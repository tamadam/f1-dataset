import type { MetadataRoute } from "next";
import { getAllF1Years } from "./lib/year-utils";
import { routing } from "@/i18n/routing";
import { APP_BASE_URL, CATEGORIES } from "./constants";
/* import { getAllDrivers } from "./lib/api/getAllDrivers";
import { getAllConstructors } from "./lib/api/getAllConstructors";
import { getAllRaces } from "./lib/api/getAllRaces"; */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const years = getAllF1Years().map(String);
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    // landing page
    routes.push({
      url: `${APP_BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    });

    for (const year of years) {
      for (const category of CATEGORIES) {
        // category pages
        routes.push({
          url: `${APP_BASE_URL}/${locale}/results/${year}/${category}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        });

        /* if (category === "drivers") {
          const drivers = await getAllDrivers(year);
          for (const driver of drivers) {
            // driver specific pages
            routes.push({
              url: `${APP_BASE_URL}/${locale}/results/${year}/${category}/${driver.driverId}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        } else if (category === "constructors") {
          const constructors = await getAllConstructors(year);
          for (const constructor of constructors) {
            // constructor specific pages
            routes.push({
              url: `${APP_BASE_URL}/${locale}/results/${year}/${category}/${constructor.constructorId}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        } else if (category === "races") {
          const racesData = await getAllRaces(year);
          const races = racesData?.MRData.RaceTable.Races ?? [];
          for (const race of races) {
            // race specific pages
            routes.push({
              url: `${APP_BASE_URL}/${locale}/results/${year}/${category}/${race.Circuit.circuitId}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        } */
      }
    }
  }

  return routes;
}
