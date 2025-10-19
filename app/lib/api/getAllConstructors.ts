import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { ConstructorsResponse } from "@/app/types/constructors";
import { Constructor } from "@/app/types/f1Common";
import { ApiError } from "./custom-error";

// Returns the list of constructors for a given year (only the list, not the final standings)
export const getAllConstructors = async (
  year: string,
  cacheOptions?: {
    readCachedOnly?: boolean;
    skipCacheWrite?: boolean;
  }
): Promise<Constructor[]> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/constructors.json`;
    const cacheSubFolder = ["constructors"];
    const cacheKey = generateCacheKey("constructors", year);

    const skipCustomCache = false;

    const response = await fetchWithCacheAndRateLimit<ConstructorsResponse>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) => Boolean(data?.MRData?.ConstructorTable?.Constructors),
      cacheOptions?.readCachedOnly,
      cacheOptions?.skipCacheWrite
    );

    return response?.MRData?.ConstructorTable?.Constructors || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching all constructors for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
