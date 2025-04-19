export type RawDriverStandings = {
    MRData: {
        StandingsTable: DriverStandingsTable;
        limit: string;
        offset: string;
        series: string;
        total: string;
        url: string;
        xmlns?: string;
    };
};

export type DriverStandingsTable = {
    StandingsLists: StandingsList[];
    season: string;
    round: string;
};

export type StandingsList = {
    season: string;
    round: string;
    DriverStandings: DriverStanding[];
};

export type DriverStanding = {
    Constructors: Constructor[];
    Driver: Driver;
    points: string;
    position: string;
    positionText: string;
    wins: string;
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
