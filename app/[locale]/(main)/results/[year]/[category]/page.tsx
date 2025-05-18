import { notFound } from "next/navigation";
import { getAllF1Years } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import { CategoryKey, getCategory } from "./components/CategoryPageHandler";
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
  const { year, category } = await params;

  if (!CATEGORIES.includes(category as CategoryKey)) return notFound();

  const handler = getCategory(category as CategoryKey);
  const rawData = await handler.fetch(year);
  const data = handler.extract(rawData) ?? [];

  const Component = handler.Component;
  return <Component year={year} data={data} />;
}
