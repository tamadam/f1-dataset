import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.scss";
import Footer from "@/app/components/Footer/Footer";
import { setRequestLocale } from "next-intl/server";

import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { APP_BASE_URL } from "../constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const translation = await getTranslations({
    locale,
    namespace: "LandingPage",
  });

  return {
    title: translation("metadata.title"),
    description: translation("metadata.description"),
    metadataBase: new URL(APP_BASE_URL),
    openGraph: {
      title: translation("metadata.title"),
      description: translation("metadata.description"),
      images: [
        {
          url: "/images/opengraph-image.png",
          width: 2552,
          height: 1288,
          alt: translation("metadata.title"),
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: translation("metadata.title"),
      description: translation("metadata.description"),
      images: [
        {
          url: "/images/opengraph-image.png",
          width: 2552,
          height: 1288,
          alt: translation("metadata.title"),
          type: "image/png",
        },
      ],
    },
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

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
