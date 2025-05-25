
import { JSX } from "react";
import { getDriverResults } from "@/app/lib/api/getDriverResults";
import { DriverRace, RawDriverResults } from "@/app/types/driverResults";
import { ConstructorRace, RawConstructorResults } from "@/app/types/constructorResults";
import ConstructorResultsTable from "./ConstructorResultsTable";
import DriverResultsTable from "./DriverResultsTable";
import { getConstructorResults } from "@/app/lib/api/getConstructorResults";
import { RawRaceResults, Race } from "@/app/types/raceResults";
import { getRaceResults } from "@/app/lib/api/getRaceResults";
import RaceResultsTable from "./RaceResultsTable";
import { getCategory as getMainCategory } from "@/app/[locale]/(main)/results/[year]/[category]/components/CategoryPageHandler";

export type CategoryKey = keyof typeof SUBCATEGORY_HANDLERS;

type CategoryMap = {
    races: {
      Raw: RawRaceResults;
      Item: Race;
      Component: (props: {
        year: string;
        data: DriverRace[];
      }) => JSX.Element;
    },
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
    races: {
      fetch: getRaceResults,
      extract: (res) => res?.MRData.RaceTable.Races ?? [],
      Component: RaceResultsTable,
    },
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

export async function getSubCategoryData<T, R>(
  handler: CategoryHandler<T, R>,
  year: string,
  id: string
): Promise<R | null> {
  try {
    return await handler.fetch(year, id);
  } catch (error) {
    console.error(`Error fetching data for ${year}`, error);
    return null;
  }
}

type RaceFetchResult = {
  id: string;
};

export async function getRaceToFetch(
  category: string,
  subcategory: string,
  year: string
): Promise<RaceFetchResult | null> {
  if (category === "races") {
    const categoryHandler = getMainCategory(category as CategoryKey);
    const allRacesRaw = await categoryHandler.fetch(year);
    const allRaces = categoryHandler.extract(allRacesRaw);

    const mapped = allRaces.map(categoryHandler.selectorMap!);

    const match = mapped.find(
      (entry) => typeof entry !== "string" && entry.id === subcategory
    );
  
    if (!match || typeof match === "string" || !match.round) {
      return null;
    }
  
    return {
      id: match.round,
    };
  }

  return { id: subcategory };
}