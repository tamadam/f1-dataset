import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), "cache/api/driver-standings");

// Check whether the JSON response exists on the file system
export const isCachedResponseAvailable = async( key: string ): Promise<boolean> => {
    try {
        const filePath = path.join(CACHE_DIR, `${key}.json`);
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Save JSON response to the file system
export const setCachedResponse = async <T>( key: string, data: T ): Promise<void> => {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(data));
}

// Access JSON response from the file system
export const getCachedResponse = async<T>( key: string ): Promise<T | null> => {
    try {
        const filePath = path.join(CACHE_DIR, `${key}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch {
        return null;
    }
}

// Construct a cache key
export const generateCacheKey = ( year: string): string => {
    return `driver-standings-${year}`;
}

// Delete and recreate the cache folder
export const clearCache = async(): Promise<void> => {
    try {
        await fs.rm(CACHE_DIR, { recursive: true });
        await fs.mkdir(CACHE_DIR, { recursive: true });
    } catch (error) {
        console.error("Error clearing cache: ", error);
    }
}