import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { localizedPath } from "@/i18n/paths";
import { routing } from "@/i18n/routing";

/** Canonical + hreflang alternates for a public, localized path. */
export function alternatesFor(path: string, locale: string): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localizedPath(path, l)]),
  );
  languages["x-default"] = localizedPath(path, routing.defaultLocale);
  return { canonical: localizedPath(path, locale), languages };
}

/** Metadata for private screens: never indexed, never followed. */
export const privatePage = (title: string): Metadata => ({
  title,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
});

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();
