import { getAllRaces } from "./getAllRaces";

// Returns the total rounds for a given year
export const getTotalRounds = async (year: string): Promise<number> => {
  try {
    const allRaces = await getAllRaces(year);
    if (!allRaces?.MRData?.RaceTable?.Races) {
      return 0;
    }

    return allRaces.MRData.RaceTable.Races.length || 0;
  } catch (error) {
    throw new Error(
      `Failed to fetch total rounds for ${year}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
