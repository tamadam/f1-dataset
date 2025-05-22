import { Standings } from "./baseStandings";
import { Constructor, Driver } from "./f1Common";

export type RawDriverStandings = Standings<DriverStandings>;

export type DriverStandings = {
    Constructors: Constructor[];
    Driver: Driver;
    points: string;
    position: string;
    positionText: string;
    wins: string;
};


