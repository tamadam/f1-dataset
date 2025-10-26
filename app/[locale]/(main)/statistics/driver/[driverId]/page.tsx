import { getAllTimeDriversList } from "@/app/lib/api/getAllTimeDriversList";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

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
}: {
  params: Promise<{ locale: string; driverId: string }>;
}) => {
  const { driverId } = await params;

  return <div>DriverStatisticsPage - {driverId}</div>;
};

export default DriverStatisticsPage;
