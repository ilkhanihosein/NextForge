import Link from "next/link";
import { notFound } from "next/navigation";
import { FeaturePlayground } from "@/components/home/feature-playground";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const h = dictionary.home;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={typedLocale} dictionary={dictionary} />

      <section className="border-b border-border/60 bg-gradient-to-b from-panel/40 to-background pb-12 pt-8 md:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-brand">{dictionary.hero.badge}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {dictionary.common.subtitle}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            {dictionary.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {dictionary.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${typedLocale}#features-playground`}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              {h.trySamples}
            </Link>
            <Link
              href={`/${typedLocale}`}
              className="rounded-xl border border-border bg-panel px-5 py-3 text-sm font-semibold transition hover:border-brand"
            >
              {dictionary.hero.primaryCta}
            </Link>
            <Link
              href={siteConfig.links.nextjsDocs}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-panel px-5 py-3 text-sm font-semibold transition hover:border-brand"
            >
              {dictionary.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-6 pt-10">
        <FeaturePlayground locale={typedLocale} dictionary={dictionary} />
      </div>

      <SiteFooter locale={typedLocale} dictionary={dictionary} />
    </div>
  );
}
