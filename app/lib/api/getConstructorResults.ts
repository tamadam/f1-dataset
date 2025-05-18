import { F1_API_BASE_URL } from "@/app/constants"
import { fetchWithCacheAndRateLimit } from "./api-client"
import { generateCacheKey } from "./api-client";
import { RawConstructorResults } from "@/app/types/constructorResults";

// Returns the race-by-race results for a given constructor in a specific year
export const getConstructorResults = async( year: string, constructorId: string ): Promise<RawConstructorResults | null> => {
    try {
        const endpoint = `${F1_API_BASE_URL}/${year}/constructors/${constructorId}/results/`;
        const cacheSubFolder = ["constructor-results", `${year}`];
        const cacheKey = generateCacheKey(`constructor-results-${constructorId}`, year);
        const currentYear = new Date().getFullYear().toString();
        const isCurrentSeason = year === currentYear;
    
        const skipCustomCache = process.env.NODE_ENV !== 'production' || isCurrentSeason;
    
        return await fetchWithCacheAndRateLimit<RawConstructorResults>(
            endpoint,
            cacheSubFolder,
            cacheKey,
            skipCustomCache,
            (data) => Boolean(data?.MRData?.RaceTable?.Races),
            3600 * 24 // 1 day
        );
    } catch (error) {
        throw new Error(`Failed to fetch constructor results for ${year} for constructor ${constructorId}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}