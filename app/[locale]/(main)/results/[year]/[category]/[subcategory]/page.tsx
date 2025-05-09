import { routing } from "@/i18n/routing";
import {
  categories,
  CATEGORY_HANDLERS,
  CategoryKey,
} from "./components/SubcategoryPageHandler";
import { notFound } from "next/navigation";
import { getAllDrivers } from "@/app/lib/api/getAllDrivers";
import { getAllConstructors } from "@/app/lib/api/getAllConstructors";
// import { getAllF1Years } from "@/app/lib/year-utils";

export async function generateStaticParams() {
  // const historicalYears = getAllF1Years()
  const historicalYears = ["2023", "2022"];
  const staticParams: {
    locale: string;
    year: string;
    category: string;
    subcategory: string;
  }[] = [];

  const locales = routing.locales;
  const years = historicalYears.map((year) => year.toString());

  for (const locale of locales) {
    for (const year of years) {
      for (const category of categories) {
        if (category === "drivers") {
          const drivers = await getAllDrivers(year);
          for (const driver of drivers) {
            staticParams.push({
              locale,
              year,
              category,
              subcategory: driver.driverId,
            });
          }
        } else if (category === "constructors") {
          const constructors = await getAllConstructors(year);
          for (const constructor of constructors) {
            staticParams.push({
              locale,
              year,
              category,
              subcategory: constructor.constructorId,
            });
          }
        }
      }
    }
  }

  return staticParams;
}

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

  return <Component year={year} data={data} />;
}
