import { notFound } from "next/navigation";
import { getAllF1Years } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import {
  categories,
  CATEGORY_HANDLERS,
  CategoryKey,
} from "./components/CategoryPageHandler";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

export async function generateStaticParams() {
  const historicalYears = getAllF1Years();

  return routing.locales.flatMap((locale) =>
    historicalYears.flatMap((year) =>
      categories.map((category) => ({
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

  if (!(category in CATEGORY_HANDLERS)) {
    return notFound();
  }

  const validatedCategory = category as CategoryKey;

  return renderCategoryPage(validatedCategory, year);
}

async function renderCategoryPage<K extends CategoryKey>(
  category: K,
  year: string
) {
  const { fetch, extract, Component } = CATEGORY_HANDLERS[category];

  const rawData = await fetch(year);
  const data = extract(rawData);

  return (
    <ContentWrapper>
      <Component year={year} data={data} />
    </ContentWrapper>
  );
}
