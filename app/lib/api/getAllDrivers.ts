import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { DriversResponse } from "@/app/types/drivers";
import { Driver } from "@/app/types/f1Common";
import { ApiError } from "./custom-error";

// Returns the list of drivers for a given year
export const getAllDrivers = async (
  year: string,
  cacheOptions?: {
    readCachedOnly?: boolean;
    skipCacheWrite?: boolean;
  },
  baseOffset: number = 0
): Promise<Driver[]> => {
  try {
    const limit = 100;
    const endpoint = `${F1_API_BASE_URL}/${year}/drivers.json/?limit=${limit}&offset=${baseOffset}`;
    const cacheSubFolder = ["drivers"];

    const cacheKey =
      baseOffset > 0
        ? generateCacheKey("drivers", `${year}-offset${baseOffset}`)
        : generateCacheKey("drivers", year);

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

    const drivers = response?.MRData?.DriverTable?.Drivers || [];

    // Determine total drivers
    const total = Number(response?.MRData.total || 0);
    const offset = Number(response?.MRData.offset || 0);

    // If there are more drivers, recursively fetch the next page
    if (offset + limit < total) {
      const nextDrivers = await getAllDrivers(
        year,
        cacheOptions,
        offset + limit
      );
      return [...drivers, ...nextDrivers];
    }

    return drivers;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching all drivers for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
