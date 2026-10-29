import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Fraunces,
  IBM_Plex_Sans_Arabic,
  Manrope,
  Playfair_Display,
  Vazirmatn,
} from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Aurora } from "@/components/layout/aurora";
import { Providers } from "@/components/providers";
import { getDirection, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});
// Script-specific faces below aren't preloaded: the browser fetches each one only when a
// page actually contains that script (unicode-range), so English pages pay nothing.
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: false,
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});
// Fraunces has no Cyrillic: Russian headings get Playfair Display, body keeps Manrope.
const manropeCyrillic = Manrope({
  subsets: ["cyrillic"],
  variable: "--font-manrope-cyrillic",
  display: "swap",
  preload: false,
});
const playfair = Playfair_Display({
  subsets: ["cyrillic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const fontVariables = [
  manrope,
  fraunces,
  vazirmatn,
  plexArabic,
  amiri,
  manropeCyrillic,
  playfair,
]
  .map((font) => font.variable)
  .join(" ");

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "en", namespace: "metadata" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s · ${siteConfig.name}` },
    description: t("description"),
    applicationName: siteConfig.name,
    openGraph: { type: "website", siteName: siteConfig.name, locale },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#011726" },
  ],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={fontVariables}>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers dir={dir}>
            <Aurora />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
