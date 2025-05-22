import { Circuit, Constructor, Driver, FastestLap } from "./f1Common";

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
    Results: FastestLapRaceResult[];
}

export type FastestLapRaceResult = {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    grid: string;
    laps: string;
    status: string;
    Time: {
        millis: string;
        time: string;
    }
    FastestLap: FastestLap
}