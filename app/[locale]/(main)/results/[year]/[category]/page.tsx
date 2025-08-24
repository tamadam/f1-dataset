import { notFound } from "next/navigation";
import { getAllF1Years } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import {
  CategoryKey,
  getCategory,
  getCategoryData,
} from "./components/CategoryPageHandler";
import { CATEGORIES } from "@/app/constants";

export async function generateStaticParams() {
  const historicalYears = getAllF1Years({ excludeCurrent: true });

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
  if (isNaN(Number(year)) || !CATEGORIES.includes(category as CategoryKey))
    return notFound();
  const handler = getCategory(category as CategoryKey);
  const rawData = await getCategoryData(handler, year);
  if (!rawData) return notFound();

  const currentRoundData = handler.extract(rawData.data);
  const allRoundsData = {
    dataArray: rawData.dataArray
      ? handler.extractAllRounds?.(rawData.dataArray)
      : undefined,
    totalRounds: rawData.totalRounds,
  };

  const Component = handler.Component;

  return (
    <Component
      year={year}
      data={currentRoundData}
      allRoundsData={allRoundsData}
      locale={locale}
    />
  );
}
