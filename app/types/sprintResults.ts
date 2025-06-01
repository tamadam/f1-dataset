import { Circuit, SessionResults } from "./f1Common";

export type RawSprintResults = {
    MRData: {
        RaceTable: SprintRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

type SprintRaceTable = {
    season: string;
    round: string;
    Races: SprintRace[];
}

export type SprintRace = {
    season: string;
    round: string;
    url?: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time?: string;
    SprintResults: SessionResults[];
}