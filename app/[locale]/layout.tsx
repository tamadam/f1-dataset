import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.scss";
import Footer from "@/app/components/Footer/Footer";
import { setRequestLocale } from "next-intl/server";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { getCurrentYear } from "@/app/lib/year-utils";
import { Race, RawRaces } from "@/app/types/races";

export const metadata: Metadata = {
  title: "F1 Dataset",
  description: "F1 Dataset",
};

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
          <NextSessionCounter races={allRacesList} locale={locale} />

          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
