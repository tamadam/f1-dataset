import { F1_API_BASE_URL, F1_API_DRIVER_STANDINGS_URL } from "@/app/constants"
import { RawDriverStandings } from "@/app/types/driverStandings"
import { fetchWithCacheAndRateLimit } from "./api-client"
import { generateCacheKey } from "./api-client";

// Returns the driver standings for a given year (reflects current state if the season is ongoing)
export const getDriverStandings = async( year: string ): Promise<RawDriverStandings | null> => {
    try {
        const endpoint = `${F1_API_BASE_URL}/${year}/${F1_API_DRIVER_STANDINGS_URL}/`;
        const cacheSubFolder = ["driver-standings"];
        const cacheKey = generateCacheKey("driver-standings", year);
        const currentYear = new Date().getFullYear().toString();
        const isCurrentSeason = year === currentYear;
    
        const skipCustomCache = process.env.NODE_ENV !== 'production' || isCurrentSeason;
    
        return await fetchWithCacheAndRateLimit<RawDriverStandings>(
            endpoint,
            cacheSubFolder,
            cacheKey,
            skipCustomCache,
            (data) => Boolean(data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings),
        );
    } catch (error) {
        throw new Error(`Failed to fetch driver standings for ${year}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}