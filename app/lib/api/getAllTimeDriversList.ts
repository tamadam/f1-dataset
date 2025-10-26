import { Driver } from "@/app/types/f1Common";
import { ApiError } from "./custom-error";
import { getAllF1Years } from "../year-utils";
import { getAllDrivers } from "./getAllDrivers";

// Returns all of the drivers in F1 history
export const getAllTimeDriversList = async (): Promise<Driver[]> => {
  try {
    const years = getAllF1Years().map(String);
    const currentYear = years.at(-1);
    const driversPerYear = await Promise.all(
      years.map(async (year) => {
        const cacheOptions =
          year === currentYear
            ? { skipCacheWrite: true }
            : { readCachedOnly: true };

        const allDrivers = await getAllDrivers(year, cacheOptions);

        return { year, allDrivers };
      })
    );

    const allDrivers = driversPerYear.flatMap((perYear) => perYear.allDrivers);

    // Deduplicate drivers by ID
    const allTimeDriversList = Array.from(
      new Map(allDrivers.map((d) => [d.driverId, d])).values()
    ).sort((a, b) => a.givenName.localeCompare(b.givenName));

    return allTimeDriversList;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Unexpected error fetching all time drivers list ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
};
