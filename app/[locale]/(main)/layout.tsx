import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { getCurrentYear } from "@/app/lib/year-utils";
import { Race, RawRaces } from "@/app/types/races";
import { setRequestLocale } from "next-intl/server";

export default async function MainPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const currentYear: number = getCurrentYear();
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));
  const allRacesList: Race[] = rawAllRaces?.MRData.RaceTable.Races || [];

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <HeaderFull />
      <NextSessionCounter races={allRacesList} locale={locale} />
      <div>{children}</div>
    </>
  );
}
