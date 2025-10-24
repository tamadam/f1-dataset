import { setRequestLocale } from "next-intl/server";
import YearSelector from "../components/YearSelector/YearSelector";
import styles from "./layout.module.scss";
import { getAllRaces } from "@/app/lib/api/getAllRaces";

import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
/* import { getCurrentYear } from "@/app/lib/year-utils";
import { Race, RawRaces } from "@/app/types/races"; */

export const revalidate = 3600;

export default async function ResultsPageYearLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentYear: number = 2025;
  const rawAllRaces = await getAllRaces("2025");
  console.log(rawAllRaces);
  const allRacesList = rawAllRaces?.MRData.RaceTable.Races || [];

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className={styles.resultsPageYearLayoutWrapper}>
      <YearSelector />
      <NextSessionCounter races={allRacesList} locale={locale} />
      {children}
    </div>
  );
}
