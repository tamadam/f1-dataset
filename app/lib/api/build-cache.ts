import fs from 'fs/promises';
import path from 'path';

const BASE_CACHE_DIR = path.join(process.cwd(), "cache/api");

// Get the full folder for a specific type
const getCacheDir = (subDirs: string[]) => {
    return path.join(BASE_CACHE_DIR, ...subDirs);
};

// Check whether the JSON response exists on the file system
export const isCachedResponseAvailable = async( subDirs: string[], key: string ): Promise<boolean> => {
    try {
        const filePath = path.join(getCacheDir(subDirs), `${key}.json`);
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Save JSON response to the file system
export const setCachedResponse = async <T>( subDirs: string[], key: string, data: T ): Promise<void> => {
    if (process.env.PREVENT_DISK_WRITE === "1") return;
    const dir = getCacheDir(subDirs);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(data));
}

// Access JSON response from the file system
export const getCachedResponse = async<T>( subDirs: string[], key: string ): Promise<T | null> => {
    try {
        const filePath = path.join(getCacheDir(subDirs), `${key}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch {
        return null;
    }
}

// Delete and recreate the cache folder
export const clearCache = async(subDirs?: string[]): Promise<void> => {
    try {
        if (subDirs) {
            const dir = getCacheDir(subDirs);
            await fs.rm(dir, { recursive: true });
            await fs.mkdir(dir, { recursive: true });
        } else {
            await fs.rm(BASE_CACHE_DIR, { recursive: true });
            await fs.mkdir(BASE_CACHE_DIR, { recursive: true });
        }
    } catch (error) {
        console.error("Error clearing cache: ", error);
    }
}