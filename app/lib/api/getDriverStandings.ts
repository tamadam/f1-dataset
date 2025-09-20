import { F1_API_BASE_URL, F1_API_DRIVER_STANDINGS_URL } from "@/app/constants";
import { RawDriverStandings } from "@/app/types/driverStandings";
import { fetchWithCacheAndRateLimit } from "./api-client";
import { generateCacheKey } from "./api-client";
import { getAllRaces } from "./getAllRaces";
import { RoundsList } from "@/app/[locale]/(main)/results/[year]/[category]/components/CategoryPageHandler";

// Returns the driver standings for a given year (reflects current state if the season is ongoing)
export const getDriverStandings = async (
  year: string
): Promise<RawDriverStandings | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/${F1_API_DRIVER_STANDINGS_URL}/`;
    const cacheSubFolder = ["driver-standings"];
    const cacheKey = generateCacheKey("driver-standings", year);
    const currentYear = new Date().getFullYear().toString();
    const isCurrentSeason = year === currentYear;

    const skipCustomCache =
      process.env.NODE_ENV !== "production" || isCurrentSeason;

    return await fetchWithCacheAndRateLimit<RawDriverStandings>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) =>
        Boolean(
          data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
        )
    );
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
  round: number
): Promise<RawDriverStandings | null> => {
  try {
    const endpoint = `${F1_API_BASE_URL}/${year}/${round}/${F1_API_DRIVER_STANDINGS_URL}/`;
    const cacheSubFolder = ["driver-standings", year];
    const cacheKey = generateCacheKey("driver-standings", `${year}-${round}`);

    const skipCustomCache = false;

    return await fetchWithCacheAndRateLimit<RawDriverStandings>(
      endpoint,
      cacheSubFolder,
      cacheKey,
      skipCustomCache,
      (data) =>
        Boolean(
          data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
        )
    );
  } catch (error) {
    throw new Error(
      `Failed to fetch driver standings by round for ${year} round ${round}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
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
