import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { RawDriverResults } from "@/app/types/driverResults";

// Returns the race-by-race results for a given driver in a specific year
export const getDriverResults = async (
  year: string,
  driverId: string,
  cacheOptions?: {
    readCachedOnly?: boolean;
    skipCacheWrite?: boolean;
  }
): Promise<RawDriverResults | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/drivers/${driverId}/results/`;
    const cacheSubFolder = ["driver-results", `${year}`];
    const cacheKey = generateCacheKey(`driver-result-${driverId}`, year);
    const currentYear = new Date().getFullYear().toString();
    const isCurrentSeason = year === currentYear;

    const skipCustomCache =
      process.env.NODE_ENV !== "production" || isCurrentSeason;

    return await fetchWithCacheAndRateLimit<RawDriverResults>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) => Boolean(data?.MRData?.RaceTable?.Races),
      cacheOptions?.readCachedOnly,
      cacheOptions?.skipCacheWrite
    );
  } catch (error) {
    throw new Error(
      `Failed to fetch driver results for ${year} for driver ${driverId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
