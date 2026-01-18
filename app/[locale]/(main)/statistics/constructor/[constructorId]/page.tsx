export const revalidate = 3600;
export const dynamic = "force-static";

const ConstructorStatisticsPage = async ({
  params,
}: {
  params: Promise<{ locale: string; constructorId: string }>;
}) => {
  const { constructorId } = await params;

  return <div>ConstructorStatisticsPage - {constructorId}</div>;
};

export default ConstructorStatisticsPage;
