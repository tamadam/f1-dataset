/* eslint-disable @typescript-eslint/no-explicit-any */
export class RateLimiter {
  private queue: Array<{
    fn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    attempt: number;
  }> = [];

  private readonly shortTermInterval = 1000; // 1 sec
  private readonly shortTermLimit = 4; // 4 requests per second
  private shortTermTimestamps: number[] = [];

  private rejectedCalls = 0; // Counter for rejected calls

  constructor(private maxRetries = 3) {}

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    // console.log('Adding request to the queue');
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject, attempt: 0 });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) return;

    // Check short-term rate limit
    const now = Date.now();
    this.cleanOldTimestamps(now);

    if (this.shortTermTimestamps.length >= this.shortTermLimit) {
      const nextAvailable =
        this.shortTermTimestamps[0] + this.shortTermInterval;
      // console.log(`Rate limit reached. Waiting until ${new Date(nextAvailable)}`);
      await this.delay(nextAvailable - now);
    }

    // console.log(`Executing request. Current queue length: ${this.queue.length}`);
    // Execute request
    const item = this.queue.shift()!;
    if (!item) {
      // console.log("Queue was emptied while waiting — skipping.");
      return;
    }
    this.shortTermTimestamps.push(now);
    await this.executeRequest(item);
  }

  private cleanOldTimestamps(now: number) {
    this.shortTermTimestamps = this.shortTermTimestamps.filter(
      (ts) => now - ts < this.shortTermInterval
    );
  }

  private async executeRequest(item: any) {
    try {
      // console.log(`Attempting request, attempt #${item.attempt + 1}`);
      const result = await item.fn();
      console.log("Request successful");
      item.resolve(result);
    } catch (error) {
      console.log(`Request failed with error:`, error);
      if (this.shouldRetry(error, item.attempt)) {
        // console.log(`Retrying request, attempt #${item.attempt + 1}`);
        item.attempt++;
        this.queue.unshift(item);
        const delayTime = this.getBackoffDelay(item.attempt);
        // console.log(`Backing off for ${delayTime} ms before retrying.`);
        await this.delay(delayTime);
        this.processQueue();
      } else {
        console.log(`Max retries reached or non-retryable error. Rejecting.`);
        this.rejectedCalls++;
        item.reject(error);
        console.log(`Total rejected calls: ${this.rejectedCalls}`);
      }
    }
    this.processQueue();
  }

  private shouldRetry(error: any, attempt: number): boolean {
    return (
      attempt < this.maxRetries &&
      (error?.status === 429 || error?.status >= 500)
    );
  }

  private getBackoffDelay(attempt: number): number {
    const baseDelay = Math.min(10000, Math.pow(2, attempt) * 1000);
    const jitter = Math.floor(Math.random() * 5000); // random 0–5000ms
    const backoffDelay = baseDelay + jitter;
    // console.log(`Using backoff delay of ${backoffDelay} ms (base ${baseDelay} + jitter ${jitter})`);

    if (attempt > 3) {
      return baseDelay + Math.floor(Math.random() * 5000);
    }
    return backoffDelay;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
