import { getDriverResults } from "@/app/lib/api/getDriverResults";
import { getValidFinishPositions } from "@/app/lib/statistics-utils";
import { getAllF1Years, getCurrentYear } from "@/app/lib/year-utils";

export const revalidate = 3600;
export const dynamic = "force-static";

const DriverStatisticsPage = async ({
  params,
}: {
  params: Promise<{ locale: string; driverId: string }>;
}) => {
  const { driverId } = await params;

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

  // we will use this for custom filters like posiition
  // in client compoentn ijnsteasd of search params

  console.log(driverResultsPerYear);

  const wins = positions.filter((pos) => pos === "1").length;
  const podiums = positions.filter(
    (pos) => pos === "1" || pos === "2" || pos === "3"
  ).length;

  const finishPosition = "1";

  const validFinishPositions = getValidFinishPositions(finishPosition);
  const customFinishPosition =
    validFinishPositions.length > 0
      ? positions.filter((pos) => validFinishPositions.includes(pos)).length
      : undefined;

  return (
    <div>
      {new Date().toLocaleTimeString()}
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
