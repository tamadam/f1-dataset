type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export const MEMORY_CACHE_TTL = 1000 * 60 * 60; // 1 hour

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoryCache = new Map<string, CacheEntry<any>>();
