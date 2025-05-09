import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { DriversResponse } from "@/app/types/drivers";
import { Driver } from "@/app/types/baseStandings";

export const getAllDrivers = async (year: string): Promise<Driver[]> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/drivers.json`;
    const cacheSubFolder = ["drivers", `${year}`];
    const cacheKey = generateCacheKey("drivers", year);
    
    const response = await fetchWithCacheAndRateLimit<DriversResponse>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      false,
      (data) => Boolean(data?.MRData?.DriverTable?.Drivers),
      3600 * 24 // 1 day
    );

    return response?.MRData?.DriverTable?.Drivers || [];
  } catch (error) {
    throw new Error(`Failed to fetch all drivers for ${year}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};


