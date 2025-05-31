import { Circuit, DateTime } from "./f1Common";

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
    FirstPractice?: DateTime,
    SecondPractice?: DateTime,
    ThirdPractice?:DateTime,
    Qualifying?: DateTime,
    Sprint?: DateTime,
    SprintQualifying?: DateTime,
    SprintShootout?: DateTime
}
