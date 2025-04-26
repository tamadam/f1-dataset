import { routing } from "@/i18n/routing";
import { getDriverStandings } from "@/app/lib/api/getDriverStandings";
import DriverStandingsTable from "./DriverStandingsTable";
import { getAllF1Years } from "@/app/lib/year-utils";

export async function generateStaticParams() {
  const historicalYears = getAllF1Years();

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
      <DriverStandingsTable year={year} data={data} />
    </div>
  );
};

export default DriversStandingsPage;
