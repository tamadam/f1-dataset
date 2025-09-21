import { routing } from "@/i18n/routing";
import {
  CategoryKey,
  getSubCategoryHandler,
  getRaceToFetch,
  getSubCategoryDataWithMemoryCache,
  RaceFetchResult,
} from "./components/SubcategoryPageHandler";
import { notFound } from "next/navigation";
import { getAllDrivers } from "@/app/lib/api/getAllDrivers";
import { getAllConstructors } from "@/app/lib/api/getAllConstructors";
import { getAllF1Years } from "@/app/lib/year-utils";
import { CATEGORIES } from "@/app/constants";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import { getRaceResults } from "@/app/lib/api/getRaceResults";

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
        } else if (
          process.env.NODE_ENV === "production" &&
          category === "races"
        ) {
          const racesData = await getAllRaces(year);
          const races = racesData?.MRData.RaceTable.Races ?? [];
          for (const race of races) {
            const round = race.round;

            await getRaceResults(year, round);

            staticParams.push({
              locale,
              year,
              category,
              subcategory: race.Circuit.circuitId,
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
  const { locale, year, category, subcategory } = await params;

  if (isNaN(Number(year)) || !CATEGORIES.includes(category as CategoryKey))
    return notFound();

  const handler = getSubCategoryHandler(category as CategoryKey);

  let id = subcategory;
  let raceToFetch: RaceFetchResult | null = null;
  // If the category is "races", find the round based on circuitId
  if (category === "races") {
    raceToFetch = await getRaceToFetch(subcategory, year);
    if (!raceToFetch) return notFound();

    id = raceToFetch.id;
  }

  const rawData = await getSubCategoryDataWithMemoryCache(handler, year, id);
  if (!rawData) return notFound();
  const data = handler.extract(rawData) ?? [];

  // In case of races we want to handle if the user clicks on a race which has no result yet
  if (category !== "races" && (!data || data.length === 0)) {
    return notFound();
  }

  const Component = handler.Component;
  return (
    <Component year={year} data={data} locale={locale} detail={raceToFetch} />
  );
}
