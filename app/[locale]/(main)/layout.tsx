import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
import NextSessionCounterWrapper from "@/app/components/NextSessionCounter/NextSessionCounterWrapper";
import { getCurrentYear } from "@/app/lib/year-utils";
import { setRequestLocale } from "next-intl/server";
import { cacheLife } from "next/cache";

export default async function MainPageLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  "use cache";
  cacheLife("max");
  const { locale } = await params;
  const currentYear = await getCurrentYear();

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <HeaderFull currentYear={currentYear} />
      <NextSessionCounterWrapper locale={locale} currentYear={currentYear} />
      <div>{children}</div>
    </>
  );
}
