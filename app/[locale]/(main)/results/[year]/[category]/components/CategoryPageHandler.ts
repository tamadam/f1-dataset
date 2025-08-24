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
import { JSX } from "react";
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

export type CategoryKey = keyof typeof CATEGORY_HANDLERS;

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
      allRoundsData: DriverStandings[][];
    }) => JSX.Element;
  };
  constructors: {
    Raw: RawConstructorStandings;
    Item: ConstructorStandings;
    Component: (props: {
      year: string;
      data: ConstructorStandings[];
      allRoundsData: ConstructorStandings[][];
    }) => JSX.Element;
  };
  "fastest-laps": {
    Raw: RawFastestLaps;
    Item: FastestLapRace;
    Component: (props: { year: string; data: FastestLapRace[] }) => JSX.Element;
  };
};

type CategoryHandler<T, R> = {
  fetch: (year: string) => Promise<R | null>;
  fetchAllRounds?: (
    year: string
  ) => Promise<{ results: R[]; totalRounds: number }>;
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
      dataArray?: T[][];
      totalRounds?: number;
    };
  }) => JSX.Element;
};

export const CATEGORY_HANDLERS: {
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

export function getCategory<K extends CategoryKey>(category: K) {
  return CATEGORY_HANDLERS[category] as CategoryHandler<
    CategoryMap[K]["Item"],
    CategoryMap[K]["Raw"]
  >;
}

export async function getCategoryData<T, R>(
  handler: CategoryHandler<T, R>,
  year: string
): Promise<{
  data: R | null;
  dataArray?: R[] | null;
  totalRounds?: number;
} | null> {
  try {
    let dataArray: R[] | null = null;
    let totalRounds: number | undefined;
    let data: R | null = null;

    if (handler.fetchAllRounds) {
      const res = await handler.fetchAllRounds(year);
      dataArray = res?.results ?? null;
      totalRounds = res?.totalRounds;

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

    return { data, dataArray, totalRounds };
  } catch (error) {
    console.error(`Error fetching data for ${year}`, error);
    return null;
  }
}

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryDataCache = new Map<string, CacheEntry<any>>();

// 1 hour
const REQUEST_CACHE_TIME = 1000 * 60 * 60;

export async function getCategoryDataWithRequestCached<T, R>(
  handler: CategoryHandler<T, R>,
  year: string
) {
  const cacheKey = `${handler.fetch.name}-${year}`;
  const now = Date.now();
  const cached = categoryDataCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const data = await getCategoryData(handler, year);

  // Cache requests for 'REQUEST_CACHE_TIME'
  // This value is not yet stored in JSON
  categoryDataCache.set(cacheKey, {
    value: data,
    expiresAt: now + REQUEST_CACHE_TIME,
  });

  return data;
}
