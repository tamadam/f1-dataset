
/* eslint-disable @typescript-eslint/no-explicit-any */
export class RateLimiter {
    private queue: Array<{
        fn: () => Promise<any>,
        resolve: (value: any) => void,
        reject: (reason?: any) => void,
        attempt: number
    }> = [];
    
    // Short-term tracking (4req/sec)
    private shortTermTimestamps: number[] = [];
    private readonly shortTermInterval = 1000;
    private readonly shortTermLimit = 4;

    
    // State flags
    private coolingDown = false;
    private limitReached = false;

    constructor(private maxRetries = 3) {}

    async enqueue<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({
                fn,
                resolve,
                reject,
                attempt: 0
            });
            this.processQueue();
        });
    }

    private processQueue() {
        if (this.queue.length === 0 || this.coolingDown || this.limitReached) return;

        // Check short-term limit
        const now = Date.now();
        this.cleanOldTimestamps(now);
        
        if (this.shortTermTimestamps.length >= this.shortTermLimit) {
            const nextAvailable = this.shortTermTimestamps[0] + this.shortTermInterval;
            setTimeout(() => this.processQueue(), nextAvailable - now);
            return;
        }

        // Execute request
        this.shortTermTimestamps.push(now);
        
        const item = this.queue.shift()!;
        this.executeRequest(item);
    }

    private cleanOldTimestamps(now: number) {
        this.shortTermTimestamps = this.shortTermTimestamps.filter(
            ts => now - ts < this.shortTermInterval
        );
    }

    private async executeRequest(item: any) {
        try {
            const result = await item.fn();
            item.resolve(result);
        } catch (error) {
            if (this.shouldRetry(error, item.attempt)) {
                item.attempt++;
                this.queue.unshift(item);
                this.coolingDown = true;
                setTimeout(() => {
                    this.coolingDown = false;
                    this.processQueue();
                }, this.getBackoffDelay(error, item.attempt));
                return;
            }
            item.reject(error);
        }
        this.processQueue();
    }

    private shouldRetry(error: any, attempt: number): boolean {
        if (attempt >= this.maxRetries) return false;
        return error?.status === 429 || error?.status >= 500;
    }

    private getBackoffDelay(error: any, attempt: number): number {
        const retryAfter = error?.headers?.get('Retry-After');
        if (retryAfter) return parseInt(retryAfter) * 1000;
        return Math.min(10000, Math.pow(2, attempt) * 1000);
    }
}