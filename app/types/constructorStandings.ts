import { Constructor, Standings } from "./baseStandings";

export type RawConstructorStandings = Standings<ConstructorStandings>;

export type ConstructorStandings = {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: Constructor;
}