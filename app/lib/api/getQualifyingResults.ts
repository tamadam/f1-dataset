import { F1_API_BASE_URL } from "@/app/constants";
import { RawQualifyingResults } from "@/app/types/qualifyingResults";
import { fetchWithCacheAndRateLimit, generateCacheKey } from "./api-client";

// Returns the results for a given qualifying in a specific year
export const getQualifyingResults = async( year: string, round: string ): Promise<RawQualifyingResults | null> => {
    try {
        const endpoint = `${F1_API_BASE_URL}/${year}/${round}/qualifying/`;
        const cacheSubFolder = ["qualifying-results", `${year}`];
        const cacheKey = generateCacheKey(`qualifying-result-${round}`, year);
        const currentYear = new Date().getFullYear().toString();
        const isCurrentSeason = year === currentYear;
    
        const skipCustomCache = process.env.NODE_ENV !== 'production' || isCurrentSeason;
    
        return await fetchWithCacheAndRateLimit<RawQualifyingResults>(
            endpoint,
            cacheSubFolder,
            cacheKey,
            skipCustomCache,
            (data) => Boolean(data?.MRData?.RaceTable?.Races),
        );
    } catch (error) {
        throw new Error(`Failed to fetch qualifying results for ${year} for round ${round}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}