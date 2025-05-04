import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
import ResultsSelector from "./components/ResultsSelector/ResultsSelector";

/*TODO: generateMetadata*/

export default async function LandingPageLayout({
  params,
  children,
  resultsDetail,
}: Readonly<{
  children: React.ReactNode;
  resultsDetail: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  const { year } = await params;

  return (
    <>
      <HeaderFull />
      <div style={{ background: "white" }}>
        <ResultsSelector elementsLists={[]}>{resultsDetail}</ResultsSelector>
      </div>
      <main>{children}</main>
    </>
  );
}
