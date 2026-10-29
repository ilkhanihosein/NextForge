import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/paths";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo/metadata";

/** Public, indexable routes only. Each entry carries its hreflang alternates. */
const PUBLIC_PATHS = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, absoluteUrl(localizedPath(path, l))]),
      ),
    },
  }));
}
