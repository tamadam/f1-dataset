import { notFound } from "next/navigation";
import { getAllF1Years } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import {
  CategoryKey,
  getCategoryHandler,
  getCategoryDataCached,
} from "./components/CategoryPageHandler";
import { CATEGORIES } from "@/app/constants";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const historicalYears = getAllF1Years({ excludeCurrent: true }).filter(
    (year) => year >= 1980
  );

  return routing.locales.flatMap((locale) =>
    historicalYears.flatMap((year) =>
      CATEGORIES.map((category) => ({
        locale,
        year: year.toString(),
        category,
      }))
    )
  );
}

export default async function ResultsCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; year: string; category: string }>;
}) {
  const { locale, year, category } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  if (isNaN(Number(year)) || !CATEGORIES.includes(category as CategoryKey))
    return notFound();
  const handler = getCategoryHandler(category as CategoryKey);
  const rawData = await getCategoryDataCached(handler, year);
  if (!rawData.data) {
    return notFound();
  }

  const latestRoundData = handler.extract(rawData.data);
  const allRoundsData = {
    dataArray: rawData.dataArray
      ? handler.extractAllRounds?.(rawData.dataArray) ?? []
      : [],
    roundsList: rawData.roundsList || [],
  };

  const Component = handler.Component;

  return (
    <Component
      year={year}
      data={latestRoundData}
      allRoundsData={allRoundsData}
      locale={locale}
    />
  );
}
