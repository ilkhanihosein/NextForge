import type { MetadataRoute } from "next";
import { privateRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

/** Private areas are listed so well-behaved crawlers skip them; pages also send noindex. */
const PRIVATE = privateRoutes;

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    ...PRIVATE,
    ...routing.locales
      .filter((l) => l !== routing.defaultLocale)
      .flatMap((l) => PRIVATE.map((p) => `/${l}${p}`)),
  ];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
