import React from "react";
import Selector from "../../../components/ResultsSelector/Selector";
import {
  CATEGORY_HANDLERS,
  CategoryKey,
} from "../../../[year]/[category]/components/CategoryPageHandler";
import { notFound } from "next/navigation";

export default async function SelectDetailCateogry({
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
  const { fetch, extract, selectorMap } = CATEGORY_HANDLERS[category];

  const rawData = await fetch(year);
  const data = extract(rawData);
  const elements = data.map(selectorMap);

  return <Selector elements={elements} title="Results" urlKey="subcategory" />;
}
