import { Circuit } from "./f1Common";

export type RawRaces = {
    MRData: {
        RaceTable: RacesRaceTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
}

type RacesRaceTable = {
    season: string;
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
    FirstPractice?: {
        date: string;
        time: string;
    },
    SecondPractice?: {
        date: string;
        time: string;
    },
    ThirdPractice?: {
        date: string;
        time: string;
    },
    Qualifying?: {
        date: string;
        time: string;
    },
    Sprint?: {
        date: string;
        time: string;
    },
    SprintQualifying?: {
        date: string;
        time: string;
    },
    SprintShootout?: {
        date: string;
        time: string;
    }
}
