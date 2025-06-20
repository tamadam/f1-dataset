import { getDriverStandings } from "@/app/lib/api/getDriverStandings";
import DriverStandingsTable from "./DriverStandingsTable";
import { getConstructorStandings } from "@/app/lib/api/getConstructorStandings";
import ConstructorStandingsTable from "./ConstructorStandingsTable";
import { DriverStandings, RawDriverStandings } from "@/app/types/driverStandings";
import { JSX } from "react";
import { ConstructorStandings, RawConstructorStandings } from "@/app/types/constructorStandings";
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
    },
    drivers: {
      Raw: RawDriverStandings;
      Item: DriverStandings;
      Component: (props: {
        year: string;
        data: DriverStandings[];
      }) => JSX.Element;
    };
    constructors: {
      Raw: RawConstructorStandings;
      Item: ConstructorStandings;
      Component: (props: {
        year: string;
        data: ConstructorStandings[];
      }) => JSX.Element;
    };
    "fastest-laps": {
      Raw: RawFastestLaps;
      Item: FastestLapRace;
      Component: (props: {
        year: string;
        data: FastestLapRace[];
      }) => JSX.Element;
    };
};
  
type CategoryHandler<T, R> = {
    fetch: (year: string) => Promise<R | null>;
    extract: (raw: R | null) => T[];
    selectorMap?: (entry: T) => string | { id: string, name: string, round?: string };
    Component: (props: { year: string; locale?: string; data: T[] }) => JSX.Element;
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
      selectorMap: (entry) => ({ id: entry.Circuit.circuitId, name: entry.raceName, round: entry.round }),
      Component: RacesTable,
    },
    drivers: {
      fetch: getDriverStandings,
      extract: (res) =>
        res?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [],
      selectorMap: (entry) => ({ id: entry.Driver.driverId, name: `${entry.Driver.givenName} ${entry.Driver.familyName}` }),
      Component: DriverStandingsTable,
    },
    constructors: {
      fetch: getConstructorStandings,
      extract: (res) =>
        res?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [],
      selectorMap: (entry) => ( { id: entry.Constructor.constructorId, name: `${entry.Constructor.name}`}),
      Component: ConstructorStandingsTable,
    },
    "fastest-laps": {
      fetch: getFastestLaps,
      extract: (res) => res?.MRData.RaceTable.Races ?? [],
      Component: FastestLapsTable,
    }
};
  

export function getCategory<K extends CategoryKey>(category: K) {
  return CATEGORY_HANDLERS[category] as CategoryHandler<
    CategoryMap[K]['Item'],
    CategoryMap[K]['Raw']
  >;
}

export async function getCategoryData<T, R>(
  handler: CategoryHandler<T, R>,
  year: string
): Promise<R | null> {
  try {
    return await handler.fetch(year);
  } catch (error) {
    console.error(`Error fetching data for ${year}`, error);
    return null;
  }
}
