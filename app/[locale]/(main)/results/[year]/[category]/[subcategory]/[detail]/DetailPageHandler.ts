import { JSX } from "react";
import { getQualifyingResults } from "@/app/lib/api/getQualifyingResults";
import { QualifyingResult, RawQualifyingResults } from "@/app/types/qualifyingResults";
import QualifyingResultsTable from "./QualifyingResultsTable";
import { RaceFetchResult } from "../components/SubcategoryPageHandler";

export type CategoryKey = keyof typeof DETAIL_HANDLERS;

type CategoryMap = {
    qualifying: {
      Raw: RawQualifyingResults;
      Item: QualifyingResult;
      Detail: RaceFetchResult;
      Component: (props: {
        year: string;
        data: QualifyingResult[];
        detail?: RaceFetchResult;
      }) => JSX.Element;
    }
};
  
type CategoryHandler<T, R, D> = {
    fetch: (year: string, id: string) => Promise<R | null>;
    extract: (raw: R | null) => T[];
    Component: (props: { year: string; data: T[]; detail?: D; }) => JSX.Element;
};
  
export const DETAIL_HANDLERS: {
    [K in keyof CategoryMap]: CategoryHandler<
      CategoryMap[K]["Item"],
      CategoryMap[K]["Raw"],
      CategoryMap[K]["Detail"]
    >;
} = {
    qualifying: {
      fetch: getQualifyingResults,
      extract: (res) => res?.MRData.RaceTable.Races[0].QualifyingResults ?? [],
      Component: QualifyingResultsTable,
    }
};
  

export function getCategory<K extends CategoryKey>(category: K) {
  return DETAIL_HANDLERS[category] as CategoryHandler<
    CategoryMap[K]['Item'],
    CategoryMap[K]['Raw'],
    CategoryMap[K]["Detail"]
  >;
}