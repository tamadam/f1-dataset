# Caching System

The application uses a custom file system and in-memory cache to minimize redundant API calls and improve performance.  
This document explains how the caching works.

### File System Cache with Rate Limiter

The application uses a custom file-based cache to store data fetched from the API.
It is designed for data that does not change, such as past race results, reducing repeated API requests and improving performance.

**Files and Responsibilities**
The caching system is handled by three main files:

**`1. build-cache.ts`**
This file contains the code responsible for saving API responses in JSON format on the file system.
It provides 4 utility functions and the base cache directory to read, write, and clear cached data:

- `isCachedResponseAvailable(subDirs, key)` - Checks if a cached JSON file exists for the given folder and key.
- `getCachedResponse(subDirs, key)` - Reads and returns the cached data, or null if the file does not exist.
- `setCachedResponse(subDirs, key, data)` - Saves data to a JSON file in the cache folder. Writing is skipped if PREVENT_DISK_WRITE=1 is set because in production environments, such as Vercel, the filesystem is read-only at runtime. Instead of writing files dynamically, we generate them locally during the build process and deploy them with the application.
- `clearCache(subDirs?)` - Deletes and recreates either the entire cache folder or a specific subfolder.

**`2. rate-limiter.ts`**
This file contains the RateLimiter class, a **best-effort limiter** with exponential backoff that tries to avoid exceeding the API's rate limits and prevent errors like `429 - Too Many Requests`.

- Burst Limit: `4 requests per second`
- Sustained Limit: `500 requests per hour`

The class works as follows:

- `enqueue(fn)` - Adds a request function to the queue and returns a promise that resolves when the request completes. This ensures that all requests go through the rate limiter and are executed in order.
- `processQueue()` - Checks if there are requests in the queue and if the short-term rate limit allows execution. If the limit is reached, it waits until the next available time before executing the next request.
- `executeRequest(item)` - Executes the request function, handling success or failure. If the request fails due to rate limits or server errors, it retries using exponential backoff. Once successful, it resolves the promise; if all retries fail, it rejects the promise and increments the rejected calls counter.
- `shouldRetry(error, attempt)` - Determines whether a failed request should be retried. Requests are retried if the error is a 429 or a 5xx status and the number of attempts is less than the maximum allowed retries.
- `getBackoffDelay(attempt)` - Calculates how long to wait before retrying a failed request. The delay grows exponentially with each attempt, up to 10 seconds, and includes a small random jitter to reduce simultaneous retry bursts.
- `delay(ms)` - A helper function that pauses execution for a given number of milliseconds. It is used to wait between retries or until the next allowed request slot.
- `cleanOldTimestamps(now)` - Removes timestamps of requests that are older than the short-term interval. This keeps the rate limiter’s record of recent requests accurate.

**`3. api-client.ts`**
This file contains the functions that act as a bridge between the Next.js app, the file-system cache, and the rate limiter. It ensures that API requests are cached, rate-limited, and validated before being returned to the application.

The module works with `build-cache.ts` to read and write cached data, and with `rate-limiter.ts` to control request rates and retries. It also prevents multiple simultaneous requests for the same data using a cacheLocks map.

The module contains the following functions and properties:

- `fetchWithRateLimit(url, options)` - Sends a request to the API using the rate limiter. If the API responds with a 429 or an error status, it throws an error. Returns the parsed JSON response.
- `fetchWithCacheAndRateLimit(endpoint, cacheSubFolder, cacheKey, skipCustomCache, isValidResponse, revalidateTime)` - Checks if the requested data exists in the cache. If yes, returns it immediately. If not, it fetches the data from the API using fetchWithRateLimit, validates the response using isValidResponse, saves it to the cache, and returns it. Ensures that only one request per cacheKey is active at a time.
- `generateCacheKey(tag, year)` - Constructs a unique cache key from a tag and year (e.g., "constructors-2024"), used to store or retrieve cached data.
- `cacheLocks` – A Map that tracks ongoing fetches for each cache key, ensuring that only one API request per key is executed at a time to prevent duplicate fetches.

### Memory Cache

Requests are stored in the memory cache (defined in `memory-cache.ts`) regardless of whether the data is also saved in JSON or not.
This is especially useful for data that isn’t persisted in JSON, such as the current season’s constructor standings, which can still change over time.

Since this kind of data isn’t static, it isn’t saved to the file system. However, to avoid fetching it repeatedly for every request, it is temporarily stored in memory.
The memory cache is used in the category and subcategory handlers to optimize API usage and improve performance for dynamic or frequently updated data.

In this way, the memory cache acts as a complement to the file system cache, handling requests for data that may change in the future while minimizing unnecessary API calls.

### Request deduplication

Before any API fetching starts, the function is wrapped with React’s built-in `cache()`. This ensures deduplication of repeated calls with the same arguments during a single render or request, and allows React to memoize results across components that use the same data.
