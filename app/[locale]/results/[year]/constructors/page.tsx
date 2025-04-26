import { F1_FIRST_YEAR } from "@/app/constants";
import { getConstructorStandings } from "@/app/lib/api/getConstructorStandings";
import { routing } from "@/i18n/routing";
import ConstructorStandingsTable from "./ConstructorStandingsTable";

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
