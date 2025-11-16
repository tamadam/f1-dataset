import { notFound } from "next/navigation";
import { CategoryKey, getCategory } from "./components/DetailPageHandler";
import { getAllF1Years } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import { DETAILS, DETAILS_URLS } from "@/app/constants";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import {
  getRaceToFetch,
  getSubCategoryDataWithMemoryCache,
  RaceFetchResult,
} from "../components/SubcategoryPageHandler";
import { setRequestLocale } from "next-intl/server";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

export async function generateStaticParams() {
  const historicalYears = await getAllF1Years({ excludeCurrent: true });
  const staticParams: {
    locale: string;
    year: string;
    category: string;
    subcategory: string;
    detail: string;
  }[] = [];

  const locales = routing.locales;
  const years = historicalYears.map((year) => year.toString());
  const category = "races";

  for (const locale of locales) {
    for (const year of years) {
      if (process.env.NODE_ENV === "production") {
        const allRacesRaw = await getAllRaces(year);
        const races = allRacesRaw?.MRData.RaceTable.Races ?? [];

        for (const race of races) {
          // currently the API only supports the quali and sprint results
          if (DETAILS.Qualifying in race) {
            staticParams.push({
              locale,
              year,
              category,
              subcategory: `${race.Circuit.circuitId}-${race.round}`,
              detail: DETAILS_URLS.Qualifying,
            });
          }

          if (DETAILS.Sprint in race) {
            staticParams.push({
              locale,
              year,
              category,
              subcategory: `${race.Circuit.circuitId}-${race.round}`,
              detail: DETAILS_URLS.Sprint,
            });
          }
        }
      }
    }
  }

  return staticParams;
}

export default async function ResultsDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    year: string;
    category: string;
    subcategory: string;
    detail: string;
  }>;
}) {
  "use cache";
  cacheLife("days");
  const { locale, year, category, subcategory, detail } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  if (isNaN(Number(year)) || category !== "races") return notFound();

  const handler = getCategory(detail as CategoryKey);

  let id = subcategory;
  let raceToFetch: RaceFetchResult | null = null;

  // Find the round based on circuitId
  raceToFetch = await getRaceToFetch(subcategory, year);
  if (!raceToFetch) return notFound();

  // Id is the round number
  id = raceToFetch.id;

  const rawData = await getSubCategoryDataWithMemoryCache(handler, year, id);
  if (!rawData) return notFound();
  const data = handler.extract(rawData) ?? [];

  if (!data) {
    return notFound();
  }

  const Component = handler.Component;
  return (
    <Suspense>
      <Component year={year} locale={locale} data={data} detail={raceToFetch} />
    </Suspense>
  );
}
