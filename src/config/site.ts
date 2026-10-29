/** Brand + product identity. Everything user-facing and swappable lives here. */
export const siteConfig = {
  name: "NextForge",
  shortName: "NextForge",
  description:
    "A full-stack Next.js foundation: feature-based, multilingual and secure by default.",
  /** Used for absolute URLs (metadata, sitemap, emails). Override with NEXT_PUBLIC_APP_URL. */
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locales: ["en", "fa"] as const,
  defaultLocale: "en" as const,
  rtlLocales: ["fa"] as readonly string[],
  social: {} as Record<string, string>,
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export const getDirection = (locale: string) =>
  siteConfig.rtlLocales.includes(locale) ? "rtl" : "ltr";
