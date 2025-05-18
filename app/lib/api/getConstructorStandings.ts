import { F1_API_BASE_URL, F1_API_CONSTRUCTOR_STANDINGS_URL } from "@/app/constants"
import { RawConstructorStandings } from "@/app/types/constructorStandings";
import { fetchWithCacheAndRateLimit } from "./api-client"
import { generateCacheKey } from "./api-client";

// Returns the constructor standings for a given year (reflects current state if the season is ongoing)
export const getConstructorStandings = async( year: string ): Promise<RawConstructorStandings | null> => {
    try {
        const endpoint = `${F1_API_BASE_URL}/${year}/${F1_API_CONSTRUCTOR_STANDINGS_URL}/`;
        const cacheSubFolder = ["constructor-standings"];
        const cacheKey = generateCacheKey("constructor-standings", year);
        const currentYear = new Date().getFullYear().toString();
        const isCurrentSeason = year === currentYear;
    
        const skipCustomCache = process.env.NODE_ENV !== 'production' || isCurrentSeason;
    
        return await fetchWithCacheAndRateLimit<RawConstructorStandings>(
            endpoint,
            cacheSubFolder,
            cacheKey,
            skipCustomCache,
            (data) => Boolean(data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings),
            3600 * 24 // 1 day
        );
    } catch (error) {
        throw new Error(`Failed to fetch constructor standings for ${year}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}