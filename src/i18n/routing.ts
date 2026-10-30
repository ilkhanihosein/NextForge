import { defineRouting } from "next-intl/routing";
import { siteConfig } from "@/config/site";

export const routing = defineRouting({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  // Default locale lives at "/", the others under "/fa/…". "/en/…" redirects to "/…".
  localePrefix: "as-needed",
  // Don't redirect on Accept-Language: one URL = one language, which is what search
  // engines and shared links expect. Visitors switch explicitly.
  localeDetection: false,
  // Without detection the language cookie is never read, so don't set it at all.
  localeCookie: false,
});
