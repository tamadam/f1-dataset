/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCachedResponse, setCachedResponse } from "./build-cache";
import { RateLimiter } from "./rate-limiter";

const DEFAULT_REVALIDATE_TIME = 3600; // 1 hour

const limiter = new RateLimiter();

// Prevent multiple concurrent fetches for the same key
const cacheLocks = new Map<string, Promise<unknown>>();

export const fetchWithRateLimit = async <T>(
  url: string,
  options?: RequestInit
): Promise<T | null> => {
  return await limiter.enqueue<T>(async () => {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const error: any = new Error(`Rate limited - ${response.statusText}`);
      error.status = 429;
      error.headers = response.headers;
      throw error;
    }

    if (!response.ok) {
      throw new Error(`Request failed - ${response.status}`);
    }

    return response.json();
  });
};

export const fetchWithCacheAndRateLimit = async <T>(
  endpoint: string,
  cacheSubFolder: string[],
  cacheKey: string,
  skipCustomCache: boolean,
  isValidResponse: (data: T) => boolean,
  readCachedOnly = false,
  skipCacheWrite = false,
  revalidateTime = DEFAULT_REVALIDATE_TIME
): Promise<T | null> => {
  if (skipCustomCache) {
    return fetchWithRateLimit<T>(endpoint, {
      next: { revalidate: revalidateTime },
    });
  }

  const cached = await getCachedResponse<T>(cacheSubFolder, cacheKey);
  if (cached) {
    return cached;
  }

  // Skip fetching if data is not cached and readCachedOnly is set
  if (readCachedOnly) {
    return null;
  }

  // Ensure only one fetch happens for the same cacheKey
  if (!cacheLocks.has(cacheKey)) {
    const fetchDataPromise = (async () => {
      try {
        const data: T | null = await fetchWithRateLimit<T>(endpoint, {
          next: { revalidate: revalidateTime },
        });

        // Request was skipped due to rate limits
        if (data === null) {
          return null;
        }

        if (!isValidResponse(data)) {
          throw new Error("Invalid API response structure.");
        }

        if (!skipCacheWrite) {
          await setCachedResponse(cacheSubFolder, cacheKey, data);
        }

        return data;
      } catch (error) {
        console.log(error);
        throw new Error(
          `Fetch failed in api-client: ${(error as Error).message}`
        );
      } finally {
        cacheLocks.delete(cacheKey);
      }
    })();
    cacheLocks.set(cacheKey, fetchDataPromise);
  }

  return (await cacheLocks.get(cacheKey)) as Promise<T>;
};

// Construct a cache key
export const generateCacheKey = (tag: string, year: string): string => {
  return `${tag}-${year}`;
};
