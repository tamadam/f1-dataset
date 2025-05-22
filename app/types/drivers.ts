import { Driver } from "./f1Common";

export interface DriversResponse {
  MRData: MRData;
}

export interface MRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  DriverTable: DriverTable;
}

export interface DriverTable {
  season: string;
  Drivers: Driver[];
}
  

  
