/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAllF1Years } from "@/app/lib/year-utils";
import styles from "./page.module.scss";
import { getAllDrivers } from "@/app/lib/api/getAllDrivers";
import { getAllConstructors } from "@/app/lib/api/getAllConstructors";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const StatisticsPage = async ({
  params,
}: PageProps<"/[locale]/statistics">) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  /*   const years = getAllF1Years().map(String);
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
 */

  return (
    <div className={styles.statisticsPageWrapper}>
      statistics
      {/*   <div className={styles.statisticsPageContent}>
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
      </div> */}
    </div>
  );
};

export default StatisticsPage;
