import { F1_API_BASE_URL } from "@/app/constants";
import { RawRaces } from "@/app/types/races";
import { fetchWithCacheAndRateLimit, generateCacheKey } from "./api-client";

// Returns the list of races for a given year
export const getAllRaces = async (year: string): Promise<RawRaces | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/races`;
    const cacheSubFolder = ["races"];
    const cacheKey = generateCacheKey("races", year);

    const skipCustomCache = false;

    return await fetchWithCacheAndRateLimit<RawRaces>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) => Boolean(data?.MRData?.RaceTable?.Races)
    );
  } catch (error) {
    throw new Error(
      `Failed to fetch all races for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
