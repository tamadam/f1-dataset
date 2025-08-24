import {
  F1_API_BASE_URL,
  F1_API_CONSTRUCTOR_STANDINGS_URL,
} from "@/app/constants";
import { RawConstructorStandings } from "@/app/types/constructorStandings";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { getTotalRounds } from "./getTotalRounds";

// Returns the constructor standings for a given year (reflects current state if the season is ongoing)
export const getConstructorStandings = async (
  year: string
): Promise<RawConstructorStandings | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/${F1_API_CONSTRUCTOR_STANDINGS_URL}/`;
    const cacheSubFolder = ["constructor-standings"];
    const cacheKey = generateCacheKey("constructor-standings", year);
    const currentYear = new Date().getFullYear().toString();
    const isCurrentSeason = year === currentYear;

    const skipCustomCache =
      process.env.NODE_ENV !== "production" || isCurrentSeason;

    return await fetchWithCacheAndRateLimit<RawConstructorStandings>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) =>
        Boolean(
          data?.MRData?.StandingsTable?.StandingsLists?.[0]
            ?.ConstructorStandings
        )
    );
  } catch (error) {
    throw new Error(
      `Failed to fetch constructor standings for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Returns the constructor standings for a given year and for a specific round
export const getConstructorStandingsByRound = async (
  year: string,
  round: number
): Promise<RawConstructorStandings | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/${round}/${F1_API_CONSTRUCTOR_STANDINGS_URL}/`;
    const cacheSubFolder = ["constructor-standings", year];
    const cacheKey = generateCacheKey(
      "constructor-standings",
      `${year}-${round}`
    );

    const skipCustomCache = false;

    return await fetchWithCacheAndRateLimit<RawConstructorStandings>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) =>
        Boolean(
          data?.MRData?.StandingsTable?.StandingsLists?.[0]
            ?.ConstructorStandings
        )
    );
  } catch (error) {
    throw new Error(
      `Failed to fetch constructor standings by round for ${year} round ${round}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getConstructorStandingsAllRounds = async (
  year: string
): Promise<{ totalRounds: number; results: RawConstructorStandings[] }> => {
  try {
    const totalRounds = await getTotalRounds(year);
    const availableRounds = await getConstructorStandings(year);

    if (!availableRounds) return { totalRounds: 0, results: [] };

    const maxRounds = Number(availableRounds.MRData.StandingsTable.round);

    const results: RawConstructorStandings[] = [];
    for (let round = 1; round <= maxRounds; round++) {
      const standings = await getConstructorStandingsByRound(year, round);
      if (standings) {
        results.push(standings);
      }
    }

    return { totalRounds, results };
  } catch (error) {
    throw new Error(
      `Failed to fetch constructor standings with all rounds for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
