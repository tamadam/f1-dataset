import { getAllTimeDriversList } from "@/app/lib/api/getAllTimeDriversList";
import { getAllTimeConstructorsList } from "@/app/lib/api/getAllTimeConstructorsList";
import { setRequestLocale } from "next-intl/server";
import styles from "./page.module.scss";

const StatisticsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const [allTimeDriversList, allTimeConstructorsList] = await Promise.all([
    getAllTimeDriversList(),
    getAllTimeConstructorsList(),
  ]);

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
