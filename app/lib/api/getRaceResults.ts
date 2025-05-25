import { F1_API_BASE_URL } from "@/app/constants";
import { RawRaceResults } from "@/app/types/raceResults";
import { fetchWithCacheAndRateLimit, generateCacheKey } from "./api-client";

// Returns the results for a given race in a specific year
export const getRaceResults = async( year: string, round: string ): Promise<RawRaceResults | null> => {
    try {
        const endpoint = `${F1_API_BASE_URL}/${year}/${round}/results/`;
        const cacheSubFolder = ["race-results", `${year}`];
        const cacheKey = generateCacheKey(`race-result-${round}`, year);
        const currentYear = new Date().getFullYear().toString();
        const isCurrentSeason = year === currentYear;
    
        const skipCustomCache = process.env.NODE_ENV !== 'production' || isCurrentSeason;
    
        return await fetchWithCacheAndRateLimit<RawRaceResults>(
            endpoint,
            cacheSubFolder,
            cacheKey,
            skipCustomCache,
            (data) => Boolean(data?.MRData?.RaceTable?.Races),
        );
    } catch (error) {
        throw new Error(`Failed to fetch race results for ${year} for round ${round}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}