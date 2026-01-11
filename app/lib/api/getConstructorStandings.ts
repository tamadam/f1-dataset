import {
  F1_API_BASE_URL,
  F1_API_CONSTRUCTOR_STANDINGS_URL,
} from "@/app/constants";
import { RawConstructorStandings } from "@/app/types/constructorStandings";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { getAllRaces } from "./getAllRaces";
import { RoundsList } from "@/app/[locale]/(main)/results/[year]/[category]/components/CategoryPageHandler";
import { ApiError } from "./custom-error";

// Returns the constructor standings for a given year (reflects current state if the season is ongoing)
export const getConstructorStandings = async (
  year: string
): Promise<RawConstructorStandings | null> => {
  try {
    if (Number(year) < 1958) return null;

    const endpoint = `${F1_API_BASE_URL}/${year}/${F1_API_CONSTRUCTOR_STANDINGS_URL}/`;
    const cacheSubFolder = ["constructor-standings"];
    const cacheKey = generateCacheKey("constructor-standings", year);
    const currentYear = new Date().getFullYear().toString();
    const isCurrentSeason = year === currentYear;

    const skipCustomCache = isCurrentSeason;

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
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching constructor standings for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};

// Returns the constructor standings for a given year and for a specific round
export const getConstructorStandingsByRound = async (
  year: string,
  round: number
): Promise<RawConstructorStandings | null> => {
  try {
    if (Number(year) < 1958) return null;

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
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching constructor standings by round for ${year} round ${round}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};

export const getConstructorStandingsAllRounds = async (
  year: string
): Promise<{
  roundsList: RoundsList;
  results: RawConstructorStandings[];
}> => {
  try {
    if (Number(year) < 1958) return { roundsList: [], results: [] };

    const rawAllRaces = await getAllRaces(year);

    const races =
      rawAllRaces?.MRData?.RaceTable?.Races.map((race) => ({
        roundNumber: race.round,
        roundName: race.raceName,
      })) || [];

    const availableRounds = await getConstructorStandings(year);

    if (!availableRounds) return { roundsList: [], results: [] };

    const maxRounds = Number(availableRounds.MRData.StandingsTable.round);

    const results: RawConstructorStandings[] = [];
    for (let round = 1; round <= maxRounds; round++) {
      const standings = await getConstructorStandingsByRound(year, round);
      if (standings) {
        results.push(standings);
      }
    }

    return { roundsList: races, results };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching constructor standings with all rounds for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
