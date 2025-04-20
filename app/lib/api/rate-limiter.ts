export class RateLimiter {
    // Array that holds pending requests as functions 
    private queue: (() => Promise<void>)[] = [];

    // Requests that are currently in progress
    private activeRequests = 0;

    // Maximum concurrent requests allowed
    private readonly maxConcurrentRequests: number;

    // Time (ms) to wait between batches of requests
    private readonly interval: number;

    constructor(maxConcurrentRequests: number, interval: number) {
        this.maxConcurrentRequests = maxConcurrentRequests;
        this.interval = interval;
    }

    // Method to add function to the queue
    async enqueue<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            // Function that will actually run the queued task
            const execute = async () => {
                this.activeRequests++;
                try {                  
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.activeRequests--;
                    this.processQueue();
                }
            };

            this.queue.push(execute);
            this.processQueue();
        });
    }

  private processQueue() {
    // Checks if we can run more requests: concurrency limit && are there any requests waiting?
    if (this.activeRequests < this.maxConcurrentRequests && this.queue.length > 0) {
      const execute = this.queue.shift()!;
      execute();

      // Waits the specified interval before checking the queue again
      setTimeout(() => this.processQueue(), this.interval);
    }
  }
}

