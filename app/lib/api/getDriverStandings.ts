import { F1_API_BASE_URL, F1_API_DRIVER_STANDINGS_URL } from "@/app/constants";
import { RawDriverStandings } from "@/app/types/driverStandings";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { getAllRaces } from "./getAllRaces";
import { RoundsList } from "@/app/[locale]/(main)/results/[year]/[category]/components/CategoryPageHandler";
import { ApiError } from "./custom-error";

// We save the original JSON files for caching, but when returning the result,
// we replace the `DriverStandings` property with a merged array that includes
// all results from all paginated pages.
// We achieve this by recursively calling the function with a new `baseOffset`,
// which is the previous offset plus the `limit` value.

// Returns the driver standings for a given year (reflects current state if the season is ongoing)
export const getDriverStandings = async (
  year: string,
  baseOffset: number = 0
): Promise<RawDriverStandings | null> => {
  try {
    const limit = 100;
    const endpoint = `${F1_API_BASE_URL}/${year}/${F1_API_DRIVER_STANDINGS_URL}/?limit=${limit}&offset=${baseOffset}`;
    const cacheSubFolder = ["driver-standings"];
    const cacheKey =
      baseOffset > 0
        ? generateCacheKey("driver-standings", `${year}-offset${baseOffset}`)
        : generateCacheKey("driver-standings", year);

    const skipCustomCache = false;

    const response = await fetchWithCacheAndRateLimit<RawDriverStandings>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) =>
        Boolean(
          data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
        )
    );

    if (!response) return null;

    const driverStandings =
      response.MRData.StandingsTable.StandingsLists?.[0]?.DriverStandings || [];

    const total = Number(response?.MRData?.total || 0);

    // If more pages exist, recursively fetch next page
    if (baseOffset + limit < total) {
      const nextDriverStandingsPage = await getDriverStandings(
        year,
        baseOffset + limit
      );

      const nextDriverStandings =
        nextDriverStandingsPage?.MRData.StandingsTable.StandingsLists?.[0]
          ?.DriverStandings || [];

      return {
        ...response,
        MRData: {
          ...response.MRData,
          StandingsTable: {
            ...response.MRData.StandingsTable,
            StandingsLists: [
              {
                ...response.MRData.StandingsTable.StandingsLists[0],
                DriverStandings: [...driverStandings, ...nextDriverStandings],
              },
            ],
          },
        },
      };
    }

    // When only one page (<100 results)
    return response;
  } catch (error) {
    throw new Error(
      `Failed to fetch driver standings for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Returns the driver standings for a given year and for a specific round
export const getDriverStandingsByRound = async (
  year: string,
  round: number,
  baseOffset: number = 0
): Promise<RawDriverStandings | null> => {
  try {
    const limit = 100;
    const endpoint = `${F1_API_BASE_URL}/${year}/${round}/${F1_API_DRIVER_STANDINGS_URL}/?limit=${limit}&offset=${baseOffset}`;
    const cacheSubFolder = ["driver-standings", year];
    const cacheKey =
      baseOffset > 0
        ? generateCacheKey(
            "driver-standings",
            `${year}-${round}-offset${baseOffset}`
          )
        : generateCacheKey("driver-standings", `${year}-${round}`);

    const skipCustomCache = false;

    const response = await fetchWithCacheAndRateLimit<RawDriverStandings>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) =>
        Boolean(
          data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
        )
    );

    if (!response) return null;

    const driverStandings =
      response.MRData.StandingsTable.StandingsLists?.[0]?.DriverStandings || [];

    const total = Number(response?.MRData?.total || 0);

    // If more pages exist, recursively fetch next page
    if (baseOffset + limit < total) {
      const nextDriverStandingsPage = await getDriverStandingsByRound(
        year,
        round,
        baseOffset + limit
      );

      const nextDriverStandings =
        nextDriverStandingsPage?.MRData.StandingsTable.StandingsLists?.[0]
          ?.DriverStandings || [];

      return {
        ...response,
        MRData: {
          ...response.MRData,
          StandingsTable: {
            ...response.MRData.StandingsTable,
            StandingsLists: [
              {
                ...response.MRData.StandingsTable.StandingsLists[0],
                DriverStandings: [...driverStandings, ...nextDriverStandings],
              },
            ],
          },
        },
      };
    }

    // When only one page (<100 results)
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching driver standings by round for ${year} for round ${round}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};

export const getDriverStandingsAllRounds = async (
  year: string
): Promise<{
  roundsList: RoundsList;
  results: RawDriverStandings[];
}> => {
  try {
    const rawAllRaces = await getAllRaces(year);
    const races =
      rawAllRaces?.MRData?.RaceTable?.Races.map((race) => ({
        roundNumber: race.round,
        roundName: race.raceName,
      })) || [];

    const availableRounds = await getDriverStandings(year);

    if (!availableRounds) return { roundsList: [], results: [] };

    const maxRounds = Number(availableRounds.MRData.StandingsTable.round);

    const results: RawDriverStandings[] = [];
    for (let round = 1; round <= maxRounds; round++) {
      const standings = await getDriverStandingsByRound(year, round);
      if (standings) {
        results.push(standings);
      }
    }

    return { roundsList: races, results };
  } catch (error) {
    throw new Error(
      `Failed to fetch driver standings with all rounds for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
