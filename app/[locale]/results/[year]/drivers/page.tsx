import { F1_FIRST_YEAR } from "@/app/constants";
import { routing } from "@/i18n/routing";
import YearSelector from "./YearSelector";
import { getDriverStandings } from "@/app/lib/api/getDriverStandings";

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const historicalYears = Array.from(
    { length: currentYear - F1_FIRST_YEAR },
    (_, i) => 1950 + i
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

  const data = await getDriverStandings(year);

  return (
    <div
      style={{
        color: "black",
        height: "20rem",
        background: "white",
        padding: "2rem",
      }}
    >
      <YearSelector selectedYear={year} />
      DriversStandingsPage {year}
      NODE_ENV: {process.env.NODE_ENV}
      <br />
      {
        data?.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver
          .code
      }
    </div>
  );
};

export default DriversStandingsPage;
