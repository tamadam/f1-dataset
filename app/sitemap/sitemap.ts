import type { MetadataRoute } from "next";
import { getAllF1Years } from "@/app/lib/year-utils";
import { routing } from "@/i18n/routing";
import { APP_BASE_URL, CATEGORIES } from "@/app/constants";

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
      }
    }
  }

  return routes;
}
