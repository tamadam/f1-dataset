import { Circuit, Constructor, Driver } from "./f1Common";

export type RawQualifyingResults = {
    MRData: {
        RaceTable: QualifyingRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

type QualifyingRaceTable = {
    season: string;
    round: string;
    Races: QualifyingRace[];
}

export type QualifyingRace = {
    season: string;
    round: string;
    url?: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time?: string;
    QualifyingResults: QualifyingResult[];
}

export type QualifyingResult = {
    number: string;
    position: string;
    Driver: Driver;
    Constructor: Constructor;
    Q1: string;
    Q2: string;
    Q3: string;
}