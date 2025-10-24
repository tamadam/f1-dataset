import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.scss";
import Footer from "@/app/components/Footer/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentYear } from "@/app/lib/year-utils";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { Race, RawRaces } from "@/app/types/races";
import HeaderFull from "../components/Header/HeaderFull/HeaderFull";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const translation = await getTranslations({
    locale,
    namespace: "LandingPage",
  });

  return {
    title: translation("metadata.title"),
    description: translation("metadata.description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const currentYear: number = getCurrentYear();
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));
  const allRacesList: Race[] = rawAllRaces?.MRData.RaceTable.Races || [];

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <HeaderFull />
          <NextSessionCounter races={allRacesList} locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
