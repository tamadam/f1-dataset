import { Circuit, SessionResults } from "./f1Common";

export type RawFastestLaps = {
    MRData: {
        RaceTable: FastestLapRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

export type FastestLapRaceTable = {
    season: string;
    fastest: string;
    Races: FastestLapRace[]
}

export type FastestLapRace = {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    Results: SessionResults[];
}