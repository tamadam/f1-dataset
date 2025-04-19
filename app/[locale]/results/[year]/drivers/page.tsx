import { getDriverStandings } from "@/app/lib/api/getDriverStandings";

const DriversStandingsPage = async ({
  params,
}: {
  params: Promise<{ year: string }>;
}) => {
  const { year } = await params;
  const data = await getDriverStandings(year);

  console.log(data);

  return <div>DriversStandingsPage {year}</div>;
};

export default DriversStandingsPage;
