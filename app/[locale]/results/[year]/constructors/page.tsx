import { getConstructorStandings } from "@/app/lib/api/getConstructorStandings";
import { routing } from "@/i18n/routing";
import ConstructorStandingsTable from "./ConstructorStandingsTable";
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

const ConstructorStandingsPage = async ({
  params,
}: {
  params: Promise<{ year: string; locale: string }>;
}) => {
  const { year } = await params;

  const rawData = await getConstructorStandings(year);
  const data =
    rawData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;

  return (
    <div
      style={{
        color: "black",
        background: "white",
        padding: "2rem",
      }}
    >
      <ConstructorStandingsTable year={year} data={data} />
    </div>
  );
};

export default ConstructorStandingsPage;
