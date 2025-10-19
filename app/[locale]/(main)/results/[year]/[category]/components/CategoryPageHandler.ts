import {
  getDriverStandings,
  getDriverStandingsAllRounds,
} from "@/app/lib/api/getDriverStandings";
import DriverStandingsTable from "./DriverStandingsTable";
import {
  getConstructorStandings,
  getConstructorStandingsAllRounds,
} from "@/app/lib/api/getConstructorStandings";
import ConstructorStandingsTable from "./ConstructorStandingsTable";
import {
  DriverStandings,
  RawDriverStandings,
} from "@/app/types/driverStandings";
import { cache, JSX } from "react";
import {
  ConstructorStandings,
  RawConstructorStandings,
} from "@/app/types/constructorStandings";
import { FastestLapRace, RawFastestLaps } from "@/app/types/fastestLaps";
import { getFastestLaps } from "@/app/lib/api/getFastestLaps";
import FastestLapsTable from "./FastestLapsTable";
import { Race, RawRaces } from "@/app/types/races";
import RacesTable from "./RacesTable";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { MEMORY_CACHE_TTL, memoryCache } from "@/app/lib/api/memory-cache";
import { ApiError } from "@/app/lib/api/custom-error";

export type CategoryKey = keyof CategoryMap;
export type RoundsList = { roundNumber: string; roundName: string }[];

// Describe data types for each category
type CategoryMap = {
  races: {
    Raw: RawRaces;
    Item: Race;
    Component: (props: {
      year: string;
      locale?: string;
      data: Race[];
    }) => JSX.Element;
  };
  drivers: {
    Raw: RawDriverStandings;
    Item: DriverStandings;
    Component: (props: {
      year: string;
      data: DriverStandings[];
      allRoundsData?: {
        dataArray: DriverStandings[][];
        roundsList: RoundsList;
      };
    }) => JSX.Element;
  };
  constructors: {
    Raw: RawConstructorStandings;
    Item: ConstructorStandings;
    Component: (props: {
      year: string;
      data: ConstructorStandings[];
      allRoundsData?: {
        dataArray: ConstructorStandings[][];
        roundsList: RoundsList;
      };
    }) => JSX.Element;
  };
  "fastest-laps": {
    Raw: RawFastestLaps;
    Item: FastestLapRace;
    Component: (props: { year: string; data: FastestLapRace[] }) => JSX.Element;
  };
};

/*
  Template that describes how to handle data for each category
  T → the extracted item type (Item in CategoryMap)
  R → the raw API response type (Raw in CategoryMap)
*/
type CategoryHandler<T, R> = {
  fetch: (year: string) => Promise<R | null>;
  fetchAllRounds?: (year: string) => Promise<{
    results: R[];
    roundsList: RoundsList;
  }>;
  extract: (raw: R | null) => T[];
  extractAllRounds?: (raw: R[] | null) => T[][];
  isValidResponse: (raw: R | null) => boolean;
  selectorMap?: (
    entry: T
  ) => string | { id: string; name: string; round?: string };
  Component: (props: {
    year: string;
    locale?: string;
    data: T[];
    allRoundsData?: {
      dataArray: T[][];
      roundsList: RoundsList;
    };
  }) => JSX.Element;
};

// Implements handlers for each category
const CATEGORY_HANDLERS: {
  [K in keyof CategoryMap]: CategoryHandler<
    CategoryMap[K]["Item"],
    CategoryMap[K]["Raw"]
  >;
} = {
  races: {
    fetch: getAllRaces,
    extract: (res) => res?.MRData.RaceTable.Races ?? [],
    isValidResponse: (res) => Boolean(res?.MRData?.RaceTable?.Races),
    selectorMap: (entry) => ({
      id: entry.Circuit.circuitId,
      name: entry.raceName,
      round: entry.round,
    }),
    Component: RacesTable,
  },
  drivers: {
    fetch: getDriverStandings,
    fetchAllRounds: getDriverStandingsAllRounds,
    extract: (res) =>
      res?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [],
    extractAllRounds: (res) =>
      res?.map(
        (item) =>
          item.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []
      ) ?? [],
    isValidResponse: (res) =>
      Boolean(
        res?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
      ),
    selectorMap: (entry) => ({
      id: entry.Driver.driverId,
      name: `${entry.Driver.givenName} ${entry.Driver.familyName}`,
    }),
    Component: DriverStandingsTable,
  },
  constructors: {
    fetch: getConstructorStandings,
    fetchAllRounds: getConstructorStandingsAllRounds,
    extract: (res) =>
      res?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [],
    extractAllRounds: (res) =>
      res?.map(
        (item) =>
          item.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ??
          []
      ) ?? [],
    isValidResponse: (res) =>
      Boolean(
        res?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings
      ),
    selectorMap: (entry) => ({
      id: entry.Constructor.constructorId,
      name: `${entry.Constructor.name}`,
    }),
    Component: ConstructorStandingsTable,
  },
  "fastest-laps": {
    fetch: getFastestLaps,
    extract: (res) => res?.MRData.RaceTable.Races ?? [],
    isValidResponse: (res) => Boolean(res?.MRData?.RaceTable?.Races),
    Component: FastestLapsTable,
  },
};

// Returns the handler for a given category
export function getCategoryHandler<K extends CategoryKey>(category: K) {
  return CATEGORY_HANDLERS[category] as CategoryHandler<
    CategoryMap[K]["Item"],
    CategoryMap[K]["Raw"]
  >;
}

// Fetch data for a given category and year
async function getCategoryData<T, R>(
  handler: CategoryHandler<T, R>,
  year: string
): Promise<{
  data: R | null;
  dataArray: R[] | null;
  roundsList: RoundsList;
}> {
  try {
    let data: R | null = null;
    let dataArray: R[] | null = null;
    let roundsList: RoundsList = [];

    if (handler.fetchAllRounds) {
      const res = await handler.fetchAllRounds(year);
      dataArray = res?.results ?? null;
      roundsList = res?.roundsList;

      if (dataArray && dataArray.length > 0) {
        for (let i = dataArray.length - 1; i >= 0; i--) {
          if (handler.isValidResponse?.(dataArray[i])) {
            data = dataArray[i];
            break;
          }
        }
      }
    }

    // Fallback: call fetch if no valid round found
    if (!data) {
      data = await handler.fetch(year);
    }

    return { data, dataArray, roundsList };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching category data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
}

/*
  Fetches category data and caches the result in memory
  for a fixed duration stored in MEMORY_CACHE_TTL,
  and returns the cached data for subsequent calls within that period.
*/
async function getCategoryDataWithMemoryCache<T, R>(
  handler: CategoryHandler<T, R>,
  year: string
): Promise<{
  data: R | null;
  dataArray: R[] | null;
  roundsList: RoundsList;
}> {
  const cacheKey = `${handler.fetch.name}-${year}`;
  const now = Date.now();
  const cachedData = memoryCache.get(cacheKey);

  if (cachedData && cachedData.expiresAt > now) {
    return cachedData.value;
  }

  const data = await getCategoryData(handler, year);

  // Cache requests for 'MEMORY_CACHE_TTL '
  // This value is not yet stored in JSON
  if (data) {
    memoryCache.set(cacheKey, {
      value: data,
      expiresAt: now + MEMORY_CACHE_TTL,
    });
  }

  return data;
}

// Memoizes results per render tree for a single request
export const getCategoryDataCached = cache(getCategoryDataWithMemoryCache);
