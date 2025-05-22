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

export type Circuit = {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: Location;
}

export type Location = {
    lat: string;
    long: string;
    locality: string;
    country: string;
}

export type FastestLap = {
    rank: string;
    lap: string;
    Time: {
        time: string;
    };
}