import Link from "next/link";
import { notFound } from "next/navigation";
import { PostsPreview } from "@/components/home/posts-preview";
import { UsersPreview } from "@/components/home/users-preview";
import { ToastShowcase } from "@/components/home/toast-showcase";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

  return (
    <section className="flex min-h-screen flex-col py-10">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-panel/70 p-4 backdrop-blur">
        <div>
          <p className="text-sm font-medium text-brand">{dictionary.hero.badge}</p>
          <h1 className="text-xl font-bold">{dictionary.common.brand}</h1>
          <p className="text-sm text-muted-foreground">{dictionary.common.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="mt-12 grid gap-6 rounded-3xl border border-border/60 bg-gradient-to-br from-panel/70 to-accent-soft/70 p-8 shadow-soft lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {dictionary.hero.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {dictionary.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${typedLocale}`}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {dictionary.hero.primaryCta}
            </Link>
            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              className="rounded-xl border border-border bg-panel px-5 py-3 text-sm font-semibold transition hover:border-brand"
            >
              {dictionary.hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/80 p-5 lg:col-span-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Suggested Structure
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/90">
            <li>`app/[locale]/` - localized routes</li>
            <li>`components/providers/` - app providers</li>
            <li>`context/` - app context values</li>
            <li>`store/` - zustand stores</li>
            <li>`i18n/` - typed dictionaries</li>
            <li>`config/` - constants and settings</li>
            <li>`features/[domain]/api/` — service + queries per domain module</li>
          </ul>

          <div id="module-posts" className="mt-5 scroll-mt-4">
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Module: posts (`features/posts`)
              </p>
              <Link
                href={`/${typedLocale}/users`}
                className="text-xs font-semibold text-brand underline-offset-4 hover:underline"
              >
                Users →
              </Link>
            </div>
            <PostsPreview />
          </div>

          <div id="module-users" className="mt-5 scroll-mt-4">
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Module: users (`features/users`)
              </p>
              <Link
                href={`/${typedLocale}#module-posts`}
                className="text-xs font-semibold text-brand underline-offset-4 hover:underline"
              >
                Posts →
              </Link>
            </div>
            <UsersPreview />
          </div>

          <ToastShowcase />
        </div>
      </div>
    </section>
  );
}
