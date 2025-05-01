import { getDriverStandings } from "@/app/lib/api/getDriverStandings";
import DriverStandingsTable from "./DriverStandingsTable";
import { getConstructorStandings } from "@/app/lib/api/getConstructorStandings";
import ConstructorStandingsTable from "./ConstructorStandingsTable";
import { DriverStandings, RawDriverStandings } from "@/app/types/driverStandings";
import { JSX } from "react";
import { ConstructorStandings, RawConstructorStandings } from "@/app/types/constructorStandings";

export const categories = ["drivers", "constructors"] as const;

export type CategoryKey = keyof typeof CATEGORY_HANDLERS;

type CategoryMap = {
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
};
  
type CategoryHandler<T, R> = {
    fetch: (year: string) => Promise<R | null>;
    extract: (raw: R | null) => T[];
    selectorMap: (entry: T) => string;
    Component: (props: { year: string; data: T[] }) => JSX.Element;
};
  
export const CATEGORY_HANDLERS: {
    [K in keyof CategoryMap]: CategoryHandler<
      CategoryMap[K]["Item"],
      CategoryMap[K]["Raw"]
    >;
} = {
    drivers: {
      fetch: getDriverStandings,
      extract: (res) =>
        res?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [],
      selectorMap: (entry) => entry.Driver.driverId,
      Component: DriverStandingsTable,
    },
    constructors: {
      fetch: getConstructorStandings,
      extract: (res) =>
        res?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [],
      selectorMap: (entry) => entry.Constructor.constructorId,
      Component: ConstructorStandingsTable,
    },
};
  