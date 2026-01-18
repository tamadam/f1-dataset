import { setRequestLocale } from "next-intl/server";
import { getAllTimeDriversList } from "@/app/lib/api/getAllTimeDriversList";
import { getAllTimeConstructorsList } from "@/app/lib/api/getAllTimeConstructorsList";
import DriverSearchTable from "./components/SearchTables/DriverSearchTable";
import ConstructorSearchTable from "./components/SearchTables/ConstructorSearchTable";
import styles from "./page.module.scss";

export const revalidate = 60;
export const dynamic = "force-static";

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
      <DriverSearchTable
        drivers={allTimeDriversList}
        searchPlaceholder="Max Verstappen"
      />
      <ConstructorSearchTable
        constructors={allTimeConstructorsList}
        searchPlaceholder="Mercedes"
      />
    </div>
  );
};

export default StatisticsPage;
