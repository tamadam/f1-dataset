import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { DriversResponse } from "@/app/types/drivers";
import { Driver } from "@/app/types/f1Common";

// Returns the list of drivers for a given year
export const getAllDrivers = async (
  year: string,
  cacheOptions?: {
    readCachedOnly?: boolean;
    skipCacheWrite?: boolean;
  }
): Promise<Driver[]> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/drivers.json/?limit=100`;
    const cacheSubFolder = ["drivers"];
    const cacheKey = generateCacheKey("drivers", year);

    const skipCustomCache = false;

    const response = await fetchWithCacheAndRateLimit<DriversResponse>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) => Boolean(data?.MRData?.DriverTable?.Drivers),
      cacheOptions?.readCachedOnly,
      cacheOptions?.skipCacheWrite
    );

    return response?.MRData?.DriverTable?.Drivers || [];
  } catch (error) {
    throw new Error(
      `Failed to fetch all drivers for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
