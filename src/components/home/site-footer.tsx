import Link from "next/link";
import { siteConfig, type Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const h = dictionary.home;
  const base = `/${locale}`;

  return (
    <footer className="mt-16 border-t border-border/80 bg-panel/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-foreground">
              {dictionary.common.brand}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{h.footerTagline}</p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
              {h.footerNote}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {dictionary.home.featuresTitle}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href={`${base}/users`}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {h.openUsersIndex}
                </Link>
              </li>
              <li>
                <Link
                  href={`${base}/posts/1`}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {h.openPostById}
                </Link>
              </li>
              <li>
                <Link
                  href={`${base}/users/1`}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {h.openUserById}
                </Link>
              </li>
              <li>
                <Link
                  href={`${base}#toast-demo`}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {h.toastBlockTitle}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {h.footerDocs}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={siteConfig.links.nextjsDocs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Next.js
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.tanstackQueryDocs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  TanStack Query
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          {siteConfig.name} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
