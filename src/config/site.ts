export const siteConfig = {
  name: "Nova Starter",
  description: "Professional Next.js boilerplate for multilingual products.",
  locales: ["en", "fa"] as const,
  defaultLocale: "en" as const,
  /** Shown in footer / header; swap to your repo or internal docs when you ship. */
  links: {
    nextjsDocs: "https://nextjs.org/docs",
    tanstackQueryDocs: "https://tanstack.com/query/latest/docs/framework/react/overview",
  },
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export const rtlLocales: Locale[] = ["fa"];
