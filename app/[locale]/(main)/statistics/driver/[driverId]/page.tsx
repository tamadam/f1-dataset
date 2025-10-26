import { getAllTimeDriversList } from "@/app/lib/api/getAllTimeDriversList";
import { getDriverResults } from "@/app/lib/api/getDriverResults";
import { getValidFinishPositions } from "@/app/lib/search-params-utils";
import { getAllF1Years, getCurrentYear } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

// Dynamic segments not included in generateStaticParams will return a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const allTimeDriversList = await getAllTimeDriversList();

  return routing.locales.flatMap((locale) =>
    allTimeDriversList.map((driver) => ({
      locale,
      driverId: driver.driverId,
    }))
  );
}

const DriverStatisticsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; driverId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { driverId } = await params;
  const { position: finishPosition = [] } = await searchParams;

  const currentYear = getCurrentYear();
  const years = getAllF1Years();
  const results = await Promise.all(
    years.map(async (year) => {
      if (year !== currentYear) {
        const data = await getDriverResults(String(year), driverId, {
          readCachedOnly: true,
        });

        return { year, data };
      }

      const data = await getDriverResults(String(year), driverId, {
        skipCacheWrite: true,
      });

      return { year, data };
    })
  );

  const driverResultsPerYear = results.filter((result) => Boolean(result.data));

  const positions: string[] = [];

  for (const yearData of driverResultsPerYear) {
    const races = yearData.data?.MRData.RaceTable.Races ?? [];
    for (const race of races) {
      for (const result of race.Results ?? []) {
        positions.push(result.position);
      }
    }
  }

  const wins = positions.filter((pos) => pos === "1").length;
  const podiums = positions.filter(
    (pos) => pos === "1" || pos === "2" || pos === "3"
  ).length;

  const validFinishPositions = getValidFinishPositions(finishPosition);
  const customFinishPosition =
    validFinishPositions.length > 0
      ? positions.filter((pos) => validFinishPositions.includes(pos)).length
      : undefined;

  return (
    <div>
      DriverStatisticsPage - {driverId}
      <div>Wins: {wins}</div>
      <div>Podiums: {podiums}</div>
      {customFinishPosition && (
        <div>Custom Finish Position: {customFinishPosition}</div>
      )}
    </div>
  );
};

export default DriverStatisticsPage;
