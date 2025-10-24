import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { RacesProvider } from "@/app/providers/RacesProvider";
import { setRequestLocale } from "next-intl/server";

export default async function MainPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rawAllRaces = await getAllRaces("2025");
  //const allRacesList = rawAllRaces?.MRData?.RaceTable?.Races || [];

  return (
    <>
      <RacesProvider races={[]}>
        <HeaderFull />
        <div>{children}</div>
      </RacesProvider>
    </>
  );
}
