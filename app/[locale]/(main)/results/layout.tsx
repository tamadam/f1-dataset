import { setRequestLocale } from "next-intl/server";
import { getCurrentYear } from "@/app/lib/year-utils";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { Race, RawRaces } from "@/app/types/races";

export default async function ResultsPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const currentYear: number = getCurrentYear();
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));
  const allRacesList: Race[] = rawAllRaces?.MRData.RaceTable.Races || [];

  return (
    <>
      <NextSessionCounter races={allRacesList} locale={locale} />
      <div>{children}</div>
    </>
  );
}
