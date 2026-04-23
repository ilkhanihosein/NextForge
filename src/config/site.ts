export const siteConfig = {
  name: "Nova Starter",
  description: "Professional Next.js boilerplate for multilingual products.",
  locales: ["en", "fa"] as const,
  defaultLocale: "en" as const,
};

export type Locale = (typeof siteConfig.locales)[number];

export const rtlLocales: Locale[] = ["fa"];
