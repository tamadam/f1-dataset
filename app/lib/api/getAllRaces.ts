import { F1_API_BASE_URL } from "@/app/constants";
import { RawRaces } from "@/app/types/races";
import { fetchWithCacheAndRateLimit, generateCacheKey } from "./api-client";
import { ApiError } from "./custom-error";

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
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching all races for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
