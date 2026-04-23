import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { getDirection } from "@/i18n/get-direction";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    return {};
  }
  const dictionary = getDictionary(locale as Locale);
  return {
    title: dictionary.common.brand,
    description: dictionary.hero.description,
  };
}

export function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const direction = getDirection(typedLocale);

  return (
    <AppProviders locale={typedLocale} dictionary={dictionary}>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <main dir={direction} className="mx-auto min-h-screen w-full max-w-7xl px-4">
        {children}
      </main>
    </AppProviders>
  );
}
