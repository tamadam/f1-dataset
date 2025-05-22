import { F1_API_BASE_URL } from "@/app/constants";
import { RawFastestLaps } from "@/app/types/fastestLaps";
import { fetchWithCacheAndRateLimit, generateCacheKey } from "./api-client";

// Returns the fastest lap for each race for a given year
export const getFastestLaps = async( year: string ): Promise<RawFastestLaps | null> => {
    try {
        const endpoint = `${F1_API_BASE_URL}/${year}/fastest/${1}/results/`;
        const cacheSubFolder = ["fastest-laps"];
        const cacheKey = generateCacheKey("fastest-laps", year);
        const currentYear = new Date().getFullYear().toString();
        const isCurrentSeason = year === currentYear;
    
        const skipCustomCache = process.env.NODE_ENV !== 'production' || isCurrentSeason;
    
        return await fetchWithCacheAndRateLimit<RawFastestLaps>(
            endpoint,
            cacheSubFolder,
            cacheKey,
            skipCustomCache,
            (data) => Boolean(data?.MRData?.RaceTable?.Races),
        );
    } catch (error) {
        throw new Error(`Failed to fetch fastest laps for ${year}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}