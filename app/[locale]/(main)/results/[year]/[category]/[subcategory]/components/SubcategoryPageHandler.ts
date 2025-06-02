
import { JSX } from "react";
import { getDriverResults } from "@/app/lib/api/getDriverResults";
import { DriverRace, RawDriverResults } from "@/app/types/driverResults";
import { ConstructorRace, RawConstructorResults } from "@/app/types/constructorResults";
import ConstructorResultsTable from "./ConstructorResultsTable";
import DriverResultsTable from "./DriverResultsTable";
import { getConstructorResults } from "@/app/lib/api/getConstructorResults";
import { RawRaceResults, Race } from "@/app/types/raceResults";
import { Race as RawRace } from "@/app/types/races";
import { getRaceResults } from "@/app/lib/api/getRaceResults";
import RaceResultsTable from "./RaceResultsTable";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { DateTime } from "@/app/types/f1Common";
import { DETAILS, DETAILS_URLS } from "@/app/constants";
import { getTranslations } from "next-intl/server";

export type CategoryKey = keyof typeof SUBCATEGORY_HANDLERS;

type CategoryMap = {
    races: {
      Raw: RawRaceResults;
      Item: Race;
      Detail: RaceFetchResult;
      Component: (props: {
        year: string;
        locale?: string;
        data: DriverRace[];
        detail?: RaceFetchResult;
      }) => JSX.Element;
    },
    drivers: {
      Raw: RawDriverResults;
      Item: DriverRace;
      Detail: null;
      Component: (props: {
        year: string;
        locale?: string;
        data: DriverRace[];
      }) => JSX.Element;
    };
    constructors: {
      Raw: RawConstructorResults;
      Item: ConstructorRace;
      Detail: null;
      Component: (props: {
        year: string;
        locale?: string;
        data: ConstructorRace[];
      }) => JSX.Element;
    };
};
  
type CategoryHandler<T, R, D> = {
    fetch: (year: string, id: string) => Promise<R | null>;
    extract: (raw: R | null) => T[];
    selectorMap?: (entry: T) => string | { id: string, name: string };
    Component: (props: { year: string; locale?: string; data: T[]; detail?: D; }) => JSX.Element;
};
  
export const SUBCATEGORY_HANDLERS: {
    [K in keyof CategoryMap]: CategoryHandler<
      CategoryMap[K]["Item"],
      CategoryMap[K]["Raw"],
      CategoryMap[K]["Detail"]
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
    CategoryMap[K]['Raw'],
    CategoryMap[K]["Detail"]
  >;
}

export async function getSubCategoryData<T, R, D>(
  handler: CategoryHandler<T, R, D>,
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

export type RaceFetchResult = {
  id: string;
  raceName: string;
  circuitName: string;
} & {
  [K in keyof typeof DETAILS]: { label: string; date?: DateTime; disabled: boolean, order: number, urlKey: DETAILS_URLS | null };
};

export async function getRaceToFetch(
  subcategory: string,
  year: string
): Promise<RaceFetchResult | null> {
  const allRacesRaw = await getAllRaces(year);
  const allRaces = allRacesRaw?.MRData.RaceTable.Races as RawRace[];

  const race = allRaces.find(r => r.Circuit.circuitId === subcategory);
  if (!race) return null;

  const translate = await getTranslations("General");

  return {
    id: String(race.round),
    raceName: race.raceName,
    circuitName: race.Circuit.circuitName,
    FirstPractice: { label: translate("practice1"), date: race.FirstPractice, disabled: true, order: 0, urlKey: DETAILS_URLS.FirstPractice },
    SecondPractice: { label: translate("practice2"), date: race.SecondPractice, disabled: true, order: 1, urlKey: DETAILS_URLS.SecondPractice },
    ThirdPractice: { label: translate("practice3"), date: race.ThirdPractice, disabled: true, order: 2, urlKey: DETAILS_URLS.ThirdPractice },
    Qualifying: { label: translate("qualifying"), date: race.Qualifying, disabled: false, order: 10, urlKey: DETAILS_URLS.Qualifying },
    Sprint: { label: translate("sprint"), date: race.Sprint, disabled: false, order: 15, urlKey: DETAILS_URLS.Sprint },
    SprintQualifying: { label: translate("sprintQualifying"), date: race.SprintQualifying, disabled: true, order: 9, urlKey: DETAILS_URLS.SprintQualifying },
    SprintShootout: { label: translate("sprintShootout"), date: race.SprintShootout, disabled: true, order: 9, urlKey: DETAILS_URLS.SprintQualifying },
    Race: { label: translate("race"), date: { date: race.date, time: race.time || "" }, disabled: false, order: 20, urlKey: DETAILS_URLS.Race }
  };
}