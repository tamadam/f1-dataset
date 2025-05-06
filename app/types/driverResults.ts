import { Constructor, Driver } from "./baseStandings";
import { Circuit, FastestLap } from "./f1Common";

export type RawDriverResults = {
    MRData: {
        RaceTable: DriverRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

type DriverRaceTable = {
    season: string;
    driverId: string;
    Races: DriverRace[];
}

export type DriverRace = {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    Results: DriverRaceResult[];
}



type DriverRaceResult = {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    grid: string;
    laps: string;
    status: string;
    FastestLap: FastestLap;
}