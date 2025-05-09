import { getCachedResponse, setCachedResponse } from './build-cache';
import { RateLimiter } from "./rate-limiter";


const DEFAULT_REVALIDATE_TIME = 3600; // 1 hour
const RATE_LIMIT_CONFIG = { maxRequests: 4, intervalMs: 1000 }; // 4 req/sec

const limiter = new RateLimiter(RATE_LIMIT_CONFIG.maxRequests, RATE_LIMIT_CONFIG.intervalMs);

// Track active requests to prevent duplicates
const cacheLocks = new Map<string, Promise<void>>();

export const fetchWithRateLimit = async <T>(
    url: string,
    options?: RequestInit
): Promise<T> => {
  return limiter.enqueue(async () => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  });
}

export const fetchWithCacheAndRateLimit = async <T>(
    endpoint: string,
    cacheSubFolder: string[],
    cacheKey: string,
    skipCustomCache: boolean,
    isValidResponse: (data: T) => boolean,
    revalidateTime = DEFAULT_REVALIDATE_TIME,
): Promise<T | null> => {
  if (!skipCustomCache) {
    const cached = await getCachedResponse<T>(cacheSubFolder, cacheKey);
    if (cached) {
      return cached;
    }

    // Ensure only one fetch happens for the same cacheKey
    if (!cacheLocks.has(cacheKey)) {
      const fetchDataPromise = (async () => {
        try {
          const data: T = await fetchWithRateLimit<T>(endpoint);

          if (!isValidResponse(data)) {
            throw new Error("Invalid API response structure.");
          } 

          await setCachedResponse(cacheSubFolder, cacheKey, data);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Fetch failed in api-client: ${error.message}`);
          } else {
            throw new Error("Unknown error happened during fetching.");
          }
        } finally {
          cacheLocks.delete(cacheKey);
        }
      })();
      cacheLocks.set(cacheKey, fetchDataPromise);
    }

    // Wait for the ongoing fetch to finish
    await cacheLocks.get(cacheKey);
    return getCachedResponse<T>(cacheSubFolder, cacheKey);

  } else {
    // Always fetch fresh (with rate limiting)
    return fetchWithRateLimit<T>(
      endpoint,
      { next: { revalidate: revalidateTime } }
    );
  }
}

// Construct a cache key
export const generateCacheKey = ( tag: string, year: string ): string => {
  return `${tag}-${year}`;
}




