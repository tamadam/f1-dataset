import HeaderSimple from "@/app/components/Header/HeaderSimple/HeaderSimple";
import { getCurrentYear } from "@/app/lib/year-utils";
import { setRequestLocale } from "next-intl/server";
import { cacheLife } from "next/cache";

export default async function LandingPageLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  "use cache";
  cacheLife("max");

  const { locale } = await params;
  const currentYear = await getCurrentYear();

  setRequestLocale(locale);

  return (
    <>
      <HeaderSimple currentYear={currentYear} />
      <div>{children}</div>
    </>
  );
}
