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
import { cacheLife } from "next/cache";
import { Suspense } from "react";

export async function generateStaticParams() {
  const historicalYears = await getAllF1Years({ excludeCurrent: true });

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
}: PageProps<"/[locale]/results/[year]/[category]">) {
  "use cache";
  cacheLife("days");
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
    <Suspense>
      <Component
        year={year}
        data={latestRoundData}
        allRoundsData={allRoundsData}
        locale={locale}
      />
    </Suspense>
  );
}
