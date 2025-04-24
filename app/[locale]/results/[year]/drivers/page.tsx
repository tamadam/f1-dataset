import { F1_FIRST_YEAR } from "@/app/constants";
import { routing } from "@/i18n/routing";
import YearSelector from "../../components/YearSelector/YearSelector";
import { getDriverStandings } from "@/app/lib/api/getDriverStandings";
import DriverStandingsTable from "./DriverStandingsTable";

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const historicalYears = Array.from(
    { length: currentYear - F1_FIRST_YEAR },
    (_, i) => F1_FIRST_YEAR + i
  );

  return routing.locales.flatMap((locale) =>
    historicalYears.map((year) => ({
      locale,
      year: year.toString(),
    }))
  );
}

const DriversStandingsPage = async ({
  params,
}: {
  params: Promise<{ year: string; locale: string }>;
}) => {
  const { year } = await params;

  const rawData = await getDriverStandings(year);
  const data =
    rawData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;

  return (
    <div
      style={{
        color: "black",
        background: "white",
        padding: "2rem",
      }}
    >
      <YearSelector selectedYear={year} />
      DriversStandingsPage {year}
      NODE_ENV: {process.env.NODE_ENV}
      <br />
      <DriverStandingsTable year={year} data={data} />
    </div>
  );
};

export default DriversStandingsPage;
