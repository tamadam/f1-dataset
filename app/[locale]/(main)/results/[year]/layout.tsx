import { setRequestLocale } from "next-intl/server";
import YearSelector from "../components/YearSelector/YearSelector";
import styles from "./layout.module.scss";
/* import { getCurrentYear } from "@/app/lib/year-utils";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { Race, RawRaces } from "@/app/types/races"; */

export default async function ResultsPageYearLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  const { locale } = await params;

  /*  const currentYear: number = getCurrentYear();
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));
  const allRacesList: Race[] = rawAllRaces?.MRData.RaceTable.Races || []; */

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className={styles.resultsPageYearLayoutWrapper}>
      <YearSelector />
      {/*  <NextSessionCounter races={allRacesList} locale={locale} /> */}
      {children}
    </div>
  );
}
