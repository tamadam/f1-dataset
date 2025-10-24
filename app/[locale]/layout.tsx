import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.scss";
import Footer from "@/app/components/Footer/Footer";
import { setRequestLocale } from "next-intl/server";
import { RacesProvider } from "../providers/RacesProvider";
import { getAllRaces } from "../lib/api/getAllRaces";

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

  const rawAllRaces = await getAllRaces("2025");
  const allRacesList = rawAllRaces?.MRData?.RaceTable?.Races || [];

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <RacesProvider races={allRacesList}>
            <main>{children}</main>
          </RacesProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
