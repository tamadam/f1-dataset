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