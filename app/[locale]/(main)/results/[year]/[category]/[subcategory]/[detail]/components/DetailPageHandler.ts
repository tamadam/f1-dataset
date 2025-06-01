import { JSX } from "react";
import { getQualifyingResults } from "@/app/lib/api/getQualifyingResults";
import { QualifyingResult, RawQualifyingResults } from "@/app/types/qualifyingResults";
import QualifyingResultsTable from "./QualifyingResultsTable";
import { RaceFetchResult } from "../../components/SubcategoryPageHandler";
import { RawSprintResults } from "@/app/types/sprintResults";
import { getSprintResults } from "@/app/lib/api/getSprintResults";
import SprintResultsTable from "./SprintResultsTable";
import { SessionResults } from "@/app/types/f1Common";

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
    },
    sprint: {
      Raw: RawSprintResults;
      Item: SessionResults;
      Detail: RaceFetchResult;
      Component: (props: {
        year: string;
        data: SessionResults[];
        detail?: RaceFetchResult;
      }) => JSX.Element;
    },
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
      extract: (res) => res?.MRData.RaceTable.Races[0]?.QualifyingResults ?? [],
      Component: QualifyingResultsTable,
    },
    sprint: {
      fetch: getSprintResults,
      extract: (res) => res?.MRData.RaceTable.Races[0]?.SprintResults ?? [],
      Component: SprintResultsTable,
    }
};
  

export function getCategory<K extends CategoryKey>(category: K) {
  return DETAIL_HANDLERS[category] as CategoryHandler<
    CategoryMap[K]['Item'],
    CategoryMap[K]['Raw'],
    CategoryMap[K]["Detail"]
  >;
}