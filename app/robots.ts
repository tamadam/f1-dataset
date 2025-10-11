import type { MetadataRoute } from "next";
import { APP_BASE_URL } from "./constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${APP_BASE_URL}/sitemap.xml`,
  };
}
