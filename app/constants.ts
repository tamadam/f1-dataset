export const F1_API_BASE_URL = "https://api.jolpi.ca/ergast/f1";
export const F1_API_DRIVER_STANDINGS_URL = "driverstandings";
export const F1_API_CONSTRUCTOR_STANDINGS_URL = "constructorstandings";

export const F1_FIRST_YEAR = 1950;

export const F1_LOGO_ORIGINAL_WIDTH = 1024;
export const F1_LOGO_ORIGINAL_HEIGHT = 373;

export const CATEGORIES = [
  "races",
  "drivers",
  "constructors",
  "fastest-laps",
] as const;

export enum DETAILS {
  FirstPractice = "FirstPractice",
  SecondPractice = "SecondPractice",
  ThirdPractice = "ThirdPractice",
  Qualifying = "Qualifying",
  Sprint = "Sprint",
  SprintQualifying = "SprintQualifying",
  SprintShootout = "SprintShootout",
  Race = "Race Result",
}

export enum DETAILS_URLS {
  FirstPractice = "practice1",
  SecondPractice = "practice2",
  ThirdPractice = "practice3",
  Qualifying = "qualifying",
  Sprint = "sprint",
  SprintQualifying = "sprintqualifying",
  Race = "",
}

export const APP_BASE_URL = "https://f1-dataset.vercel.app";
