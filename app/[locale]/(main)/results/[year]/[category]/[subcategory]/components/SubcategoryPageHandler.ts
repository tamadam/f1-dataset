
import { JSX } from "react";
import { getDriverResults } from "@/app/lib/api/getDriverResults";
import { DriverRace, RawDriverResults } from "@/app/types/driverResults";
import { ConstructorRace, RawConstructorResults } from "@/app/types/constructorResults";
import ConstructorResultsTable from "./ConstructorResultsTable";
import DriverResultsTable from "./DriverResultsTable";
import { getConstructorResults } from "@/app/lib/api/getConstructorResults";

export type CategoryKey = keyof typeof SUBCATEGORY_HANDLERS;

type CategoryMap = {
    drivers: {
      Raw: RawDriverResults;
      Item: DriverRace;
      Component: (props: {
        year: string;
        data: DriverRace[];
      }) => JSX.Element;
    };
    constructors: {
      Raw: RawConstructorResults;
      Item: ConstructorRace;
      Component: (props: {
        year: string;
        data: ConstructorRace[];
      }) => JSX.Element;
    };
};
  
type CategoryHandler<T, R> = {
    fetch: (year: string, id: string) => Promise<R | null>;
    extract: (raw: R | null) => T[];
    selectorMap?: (entry: T) => string | { id: string, name: string };
    Component: (props: { year: string; data: T[] }) => JSX.Element;
};
  
export const SUBCATEGORY_HANDLERS: {
    [K in keyof CategoryMap]: CategoryHandler<
      CategoryMap[K]["Item"],
      CategoryMap[K]["Raw"]
    >;
} = {
    drivers: {
      fetch: getDriverResults,
      extract: (res) =>
        res?.MRData.RaceTable.Races ?? [],
      Component: DriverResultsTable,
    },
    constructors: {
      fetch: getConstructorResults,
      extract: (res) =>
        res?.MRData.RaceTable.Races ?? [],
      Component: ConstructorResultsTable,
    },
};
  

export function getCategory<K extends CategoryKey>(category: K) {
  return SUBCATEGORY_HANDLERS[category] as CategoryHandler<
    CategoryMap[K]['Item'],
    CategoryMap[K]['Raw']
  >;
}