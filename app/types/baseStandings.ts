import { ConstructorStandings } from "./constructorStandings";
import { DriverStandings } from "./driverStandings";

export type Standings<T> = {
    MRData: {
      StandingsTable: StandingsTable<T>;
      limit: string;
      offset: string;
      series: string;
      total: string;
      url: string;
      xmlns?: string;
    };
};
  
export type StandingsTable<T> = {
    StandingsLists: StandingsList<T>[];
    season: string;
    round: string;
};
  
export type StandingTypeMap = {
    DriverStandings: { key: "DriverStandings"; type: DriverStandings };
    ConstructorStandings: { key: "ConstructorStandings"; type: ConstructorStandings };
};
  
type StandingKey<T> = {
    [K in keyof StandingTypeMap]: T extends StandingTypeMap[K]["type"] ? StandingTypeMap[K]["key"] : never
}[keyof StandingTypeMap];
  
export type StandingsList<T> = {
    season: string;
    round: string;
} & {
    [K in StandingKey<T>]: T[];
};

export type Driver = {
    code: string;
    dateOfBirth: string;
    driverId: string;
    familyName: string;
    givenName: string;
    nationality: string;
    permanentNumber: string;
    url: string;
};

export type Constructor = {
    constructorId: string;
    name: string;
    nationality: string;
    url: string;
};
  