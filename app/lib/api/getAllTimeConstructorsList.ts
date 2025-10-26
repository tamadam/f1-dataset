import { Constructor } from "@/app/types/f1Common";
import { ApiError } from "./custom-error";
import { getAllF1Years } from "../year-utils";
import { getAllConstructors } from "./getAllConstructors";

// Returns all of the constructors in F1 history
export const getAllTimeConstructorsList = async (): Promise<Constructor[]> => {
  try {
    const years = getAllF1Years().map(String);
    const currentYear = years.at(-1);
    const constructorsPerYear = await Promise.all(
      years.map(async (year) => {
        const cacheOptions =
          year === currentYear
            ? { skipCacheWrite: true }
            : { readCachedOnly: true };

        const allConstructors = await getAllConstructors(year, cacheOptions);

        return { year, allConstructors };
      })
    );

    const allConstructors = constructorsPerYear.flatMap(
      (perYear) => perYear.allConstructors
    );

    // Deduplicate constructors by ID
    const allTimeConstructorsList = Array.from(
      new Map(allConstructors.map((c) => [c.constructorId, c])).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    return allTimeConstructorsList;
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
