import { F1_API_BASE_URL } from "@/app/constants";
import { fetchWithCacheAndRateLimit, generateCacheKey } from "./api-client";
import { RawSprintResults } from "@/app/types/sprintResults";
import { ApiError } from "./custom-error";

// Returns the results for a sprint race in a specific year
export const getSprintResults = async (
  year: string,
  round: string
): Promise<RawSprintResults | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/${round}/sprint/`;
    const cacheSubFolder = ["sprint-results", `${year}`];
    const cacheKey = generateCacheKey(`sprint-result-${round}`, year);
    const currentYear = new Date().getFullYear().toString();
    const isCurrentSeason = year === currentYear;

    const skipCustomCache =
      process.env.NODE_ENV !== "production" || isCurrentSeason;

    return await fetchWithCacheAndRateLimit<RawSprintResults>(
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
      `Unexpected error fetching sprint results for ${year} for round ${round}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
