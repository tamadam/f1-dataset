import { setRequestLocale } from "next-intl/server";
import YearSelector from "../components/YearSelector/YearSelector";
import styles from "./layout.module.scss";
import { getAllF1Years, getCurrentYear } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { Race, RawRaces } from "@/app/types/races";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const historicalYears = getAllF1Years({ excludeCurrent: true });

  return routing.locales.flatMap((locale) =>
    historicalYears.flatMap((year) => ({
      locale,
      year: year.toString(),
    }))
  );
}

export default async function ResultsPageYearLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  const { locale } = await params;

  const currentYear: number = getCurrentYear();
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));
  const allRacesList: Race[] = rawAllRaces?.MRData.RaceTable.Races || [];

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
