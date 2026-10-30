/** Brand + product identity. Everything user-facing and swappable lives here. */
export const siteConfig = {
  name: "NextForge",
  shortName: "NextForge",
  description:
    "A full-stack Next.js foundation: feature-based, multilingual and secure by default.",
  /** Used for absolute URLs (metadata, sitemap, emails). Override with NEXT_PUBLIC_APP_URL. */
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  /** Order here is the order in the language picker. */
  locales: ["en", "fa", "ar", "de", "ru"] as const,
  defaultLocale: "en" as const,
  rtlLocales: ["fa", "ar"] as readonly string[],
  /** Each language's own name, shown to people who read it (not translated). */
  localeNames: {
    en: "English",
    fa: "فارسی",
    ar: "العربية",
    de: "Deutsch",
    ru: "Русский",
  },
  social: {} as Record<string, string>,
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export const getDirection = (locale: string) =>
  siteConfig.rtlLocales.includes(locale) ? "rtl" : "ltr";
