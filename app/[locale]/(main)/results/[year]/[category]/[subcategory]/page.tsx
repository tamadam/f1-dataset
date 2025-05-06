import {
  CATEGORY_HANDLERS,
  CategoryKey,
} from "./components/SubcategoryPageHandler";
import { notFound } from "next/navigation";

export default async function ResultsSubcategoryPage({
  params,
}: {
  params: Promise<{
    locale: string;
    year: string;
    category: string;
    subcategory: string;
  }>;
}) {
  const { year, category, subcategory } = await params;

  if (!(category in CATEGORY_HANDLERS)) {
    return notFound();
  }

  const validatedCategory = category as CategoryKey;

  return renderCategoryPage(validatedCategory, subcategory, year);
}

async function renderCategoryPage<K extends CategoryKey>(
  category: K,
  subcategory: string,
  year: string
) {
  const { fetch, extract, Component } = CATEGORY_HANDLERS[category];

  const rawData = await fetch(year, subcategory);
  const data = extract(rawData);

  return (
    <div style={{ color: "black", background: "white", padding: "2rem" }}>
      <Component year={year} data={data} />
    </div>
  );
}
