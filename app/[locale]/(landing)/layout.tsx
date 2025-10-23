import HeaderSimple from "@/app/components/Header/HeaderSimple/HeaderSimple";
import { getTranslations } from "next-intl/server";
import { getCurrentYear } from "@/app/lib/year-utils";
import { RawRaces } from "@/app/types/races";
import { setRequestLocale } from "next-intl/server";
import { getAllRaces } from "@/app/lib/api/getAllRaces";

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

export default async function LandingPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Adding this fetch, same as in the sibling layout, to prevent a weird build time error
  const currentYear: number = getCurrentYear();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <HeaderSimple />
      <div>{children}</div>
    </>
  );
}
