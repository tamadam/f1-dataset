import ResultsSelector from "./components/ResultsSelector/ResultsSelector";

/*TODO: generateMetadata*/

export default async function ResultsPageLayout({
  params,
  children,
  resultsDetail,
}: Readonly<{
  children: React.ReactNode;
  resultsDetail: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { year } = await params;

  return (
    <>
      <ResultsSelector elementsLists={[]}>{resultsDetail}</ResultsSelector>
      <main>{children}</main>
    </>
  );
}
