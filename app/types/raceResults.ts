import { Circuit, SessionResults } from "./f1Common";

export type RawRaceResults = {
    MRData: {
        RaceTable: RaceResultsRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

type RaceResultsRaceTable = {
    season: string;
    round: string;
    Races: Race[];
}

export type Race = {
    season: string;
    round: string;
    url?: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time?: string;
    Results: SessionResults[];
}

export type RaceResultRow = {
    round: string;
    raceName: string;
    position: string;
    number: string;
    driverName: string;
    driverId: string;
    constructorName: string;
    constructorId: string;
    laps: string;
    timeOrStatus: string;
    points: string;
};