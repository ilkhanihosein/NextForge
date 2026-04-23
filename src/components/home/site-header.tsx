import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const h = dictionary.home;
  const base = `/${locale}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={base}
            className="shrink-0 font-semibold tracking-tight text-foreground transition hover:text-brand"
          >
            {dictionary.common.brand}
          </Link>
          <nav
            className="flex flex-wrap items-center gap-1 text-sm font-medium text-muted-foreground"
            aria-label="Primary"
          >
            <Link
              href={base}
              className="rounded-lg px-2 py-1 transition hover:bg-muted hover:text-foreground"
            >
              {h.navHome}
            </Link>
            <Link
              href={`${base}/users`}
              className="rounded-lg px-2 py-1 transition hover:bg-muted hover:text-foreground"
            >
              {h.navUsers}
            </Link>
            <Link
              href={`${base}/posts/1`}
              className="rounded-lg px-2 py-1 transition hover:bg-muted hover:text-foreground"
            >
              {h.navSamplePost}
            </Link>
            <Link
              href={`${base}/users/1`}
              className="rounded-lg px-2 py-1 transition hover:bg-muted hover:text-foreground"
            >
              {h.navSampleUser}
            </Link>
            <a
              href={siteConfig.links.nextjsDocs}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-2 py-1 transition hover:bg-muted hover:text-foreground"
            >
              {h.navDocs}
            </a>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
