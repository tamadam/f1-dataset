import { Standings } from "./baseStandings";
import { Constructor } from "./f1Common";

export type RawConstructorStandings = Standings<ConstructorStandings>;

export type ConstructorStandings = {
    position: string;
    positionText: string;
    points: string;
    wins: string;
    Constructor: Constructor;
}