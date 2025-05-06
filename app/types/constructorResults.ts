import { Constructor, Driver } from "./baseStandings";
import { Circuit, FastestLap } from "./f1Common";

export type RawConstructorResults = {
    MRData: {
        RaceTable: ConstructorRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

type ConstructorRaceTable = {
    season: string;
    constructorId: string;
    Races: ConstructorRace[];
}

export type ConstructorRace = {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    Results: ConstructorRaceResult[];
}

type ConstructorRaceResult = {
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
    },
    FastestLap: FastestLap;
}