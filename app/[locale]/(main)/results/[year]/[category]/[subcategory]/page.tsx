import { routing } from "@/i18n/routing";
import { CategoryKey, getCategory } from "./components/SubcategoryPageHandler";
import { notFound } from "next/navigation";
import { getAllDrivers } from "@/app/lib/api/getAllDrivers";
import { getAllConstructors } from "@/app/lib/api/getAllConstructors";
import { getAllF1Years } from "@/app/lib/year-utils";
import { CATEGORIES } from "@/app/constants";

export async function generateStaticParams() {
  const historicalYears = getAllF1Years({ excludeCurrent: true });
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
      for (const category of CATEGORIES) {
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

  if (!CATEGORIES.includes(category as CategoryKey)) return notFound();

  const handler = getCategory(category as CategoryKey);
  const rawData = await handler.fetch(year, subcategory);
  const data = handler.extract(rawData) ?? [];

  const Component = handler.Component;
  return <Component year={year} data={data} />;
}
