"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Current path + query, so switching language keeps you on the same page. */
function useHereHref() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  return search ? `${pathname}?${search}` : pathname;
}

/**
 * Each language in its own name and script, which is what its readers look for. No `dir`
 * per name: a one-word name reads fine either way, and every row lines up with the menu.
 */
function LanguageName({ code }: { code: (typeof routing.locales)[number] }) {
  return (
    <span lang={code} className="min-w-0 flex-1 truncate text-start">
      {siteConfig.localeNames[code]}
    </span>
  );
}

function Switcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const href = useHereHref();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t("switchLanguage")}
        className={buttonVariants({
          variant: "glass",
          size: "sm",
          className: cn("group data-popup-open:bg-glass-strong", className),
        })}
      >
        <Languages aria-hidden />
        <span lang={locale}>{siteConfig.localeNames[locale]}</span>
        <ChevronDown
          className="-me-1 text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180"
          aria-hidden
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          sideOffset={8}
          align="end"
          collisionPadding={12}
          className="z-50"
        >
          <Menu.Popup
            className={cn(
              "min-w-56 origin-(--transform-origin) rounded-2xl p-1.5 text-foreground shadow-2xl glass-strong outline-none",
              "transition-[transform,opacity] duration-150 ease-out",
              "data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            )}
          >
            {routing.locales.map((code) => (
              <Menu.LinkItem
                key={code}
                render={<Link href={href} locale={code} hrefLang={code} />}
                aria-current={code === locale ? "true" : undefined}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 text-sm outline-none select-none data-highlighted:bg-[color-mix(in_oklab,var(--brand)_13%,transparent)]"
              >
                <LanguageName code={code} />
                {code === locale ? (
                  <Check className="size-4 shrink-0 text-brand" aria-hidden />
                ) : null}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/** Dropdown of every language, keeping the current path and query. */
export function LocaleSwitcher({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={<span className={cn("h-9 w-28 rounded-full bg-muted", className)} />}
    >
      <Switcher className={className} />
    </Suspense>
  );
}

function List({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const href = useHereHref();
  return (
    <ul aria-label={t("switchLanguage")} className="grid grid-cols-2 gap-1">
      {routing.locales.map((code) => (
        <li key={code}>
          <Link
            href={href}
            locale={code}
            hrefLang={code}
            onClick={onNavigate}
            aria-current={code === locale ? "true" : undefined}
            className={cn(
              "flex min-h-12 items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition",
              code === locale ? "bg-glass-strong shadow-glass" : "hover:bg-glass",
            )}
          >
            <LanguageName code={code} />
            {code === locale ? (
              <Check className="size-4 shrink-0 text-brand" aria-hidden />
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The same choice as a tappable list, for the mobile menu. */
export function LocaleList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense>
      <List onNavigate={onNavigate} />
    </Suspense>
  );
}
