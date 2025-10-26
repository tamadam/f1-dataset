import { getAllTimeConstructorsList } from "@/app/lib/api/getAllTimeConstructorsList";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

// Dynamic segments not included in generateStaticParams will return a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const allTimeConstructorsList = await getAllTimeConstructorsList();

  return routing.locales.flatMap((locale) =>
    allTimeConstructorsList.map((constructor) => ({
      locale,
      constructorId: constructor.constructorId,
    }))
  );
}

const ConstructorStatisticsPage = async ({
  params,
}: {
  params: Promise<{ locale: string; constructorId: string }>;
}) => {
  const { constructorId } = await params;

  return <div>ConstructorStatisticsPage - {constructorId}</div>;
};

export default ConstructorStatisticsPage;
