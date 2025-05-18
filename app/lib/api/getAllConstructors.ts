import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { ConstructorsResponse } from "@/app/types/constructors";
import { Constructor } from "@/app/types/baseStandings";

// Returns the list of constructors for a given year (only the list, not the final standings)
export const getAllConstructors = async (year: string): Promise<Constructor[]> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/constructors.json`;
    const cacheSubFolder = ["constructors", `${year}`];
    const cacheKey = generateCacheKey("constructors", year);
    
    const response = await fetchWithCacheAndRateLimit<ConstructorsResponse>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      false,
      (data) => Boolean(data?.MRData?.ConstructorTable?.Constructors),
      3600 * 24 // 1 day
    );

    return response?.MRData?.ConstructorTable?.Constructors || []
  } catch (error) {
    throw new Error(`Failed to fetch all constructors for ${year}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};