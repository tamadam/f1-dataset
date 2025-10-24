import { getAllF1Years } from "@/app/lib/year-utils";
import styles from "./page.module.scss";
import { getAllDrivers } from "@/app/lib/api/getAllDrivers";
import { getAllConstructors } from "@/app/lib/api/getAllConstructors";
import { setRequestLocale } from "next-intl/server";

const StatisticsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const years = getAllF1Years().map(String);
  const currentYear = years.at(-1);
  const driversAndConstructorsByYear = await Promise.all(
    years.map(async (year) => {
      const cacheOptions =
        year === currentYear
          ? { skipCacheWrite: true }
          : { readCachedOnly: true };

      const [allDrivers, allConstructors] = await Promise.all([
        getAllDrivers(year, cacheOptions),
        getAllConstructors(year, cacheOptions),
      ]);

      return { year, allDrivers, allConstructors };
    })
  );

  const allDrivers = driversAndConstructorsByYear.flatMap(({ allDrivers }) =>
    allDrivers.map((driver) => driver)
  );

  const allConstructors = driversAndConstructorsByYear.flatMap(
    ({ allConstructors }) => allConstructors.map((constructor) => constructor)
  );

  // Deduplicate drivers and constructors by ID
  const [allTimeDriversList, allTimeConstructorsList] = [
    Array.from(new Map(allDrivers.map((d) => [d.driverId, d])).values()).sort(
      (a, b) => a.givenName.localeCompare(b.givenName)
    ),
    Array.from(
      new Map(allConstructors.map((c) => [c.constructorId, c])).values()
    ).sort((a, b) => a.name.localeCompare(b.name)),
  ];

  /* const results = await Promise.all(
    years.map(async (year) => {
      if (year !== currentYear) {
        const data = await getDriverResults(year, "max_verstappen", {
          readCachedOnly: true,
        });

        return { year, data };
      }

      const data = await getDriverResults(year, "max_verstappen", {
        skipCacheWrite: true,
      });
      console.log("FORCURRENTYEAR: ", data);
      return { year, data };
    })
  );

  const driverResultsPerYear = results.filter((result) => Boolean(result.data));

  console.log(driverResultsPerYear);

  const allWins = driverResultsPerYear
    .map((dr) =>
      dr.data?.MRData.RaceTable.Races.map((r) =>
        r.Results.map((res) => res.position)
      ).flat(1)
    )
    .flat(1)
    .filter((pos) => pos === "1" || pos === "2" || pos === "3").length;

  console.log(allWins); */

  return (
    <div className={styles.statisticsPageWrapper}>
      <div className={styles.statisticsPageContent}>
        <h1>Drivers</h1> {allTimeDriversList.length}
        <select>
          {allTimeDriversList.map((d) => (
            <option key={d.driverId}>
              {d.givenName} {d.familyName}
            </option>
          ))}
        </select>
        <h1>Constructors</h1>
        <select>
          {allTimeConstructorsList.map((c) => (
            <option key={c.constructorId}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StatisticsPage;
