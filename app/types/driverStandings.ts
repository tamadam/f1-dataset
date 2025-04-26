import { Constructor, Driver, Standings } from "./baseStandings";

export type RawDriverStandings = Standings<DriverStandings>;

export type DriverStandings = {
    Constructors: Constructor[];
    Driver: Driver;
    points: string;
    position: string;
    positionText: string;
    wins: string;
};


