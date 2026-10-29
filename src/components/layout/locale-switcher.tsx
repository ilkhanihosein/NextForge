"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function Switcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const next = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={search ? `${pathname}?${search}` : pathname}
      locale={next}
      hrefLang={next}
      className={buttonVariants({ variant: "glass", size: "sm", className })}
      aria-label={t("switchLanguage")}
    >
      <Languages aria-hidden />
      <span lang={next}>{t(`languages.${next}`)}</span>
    </Link>
  );
}

/** Cycles to the next locale, keeping the current path and query. */
export function LocaleSwitcher({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={<span className={cn("h-9 w-20 rounded-full bg-muted", className)} />}
    >
      <Switcher className={className} />
    </Suspense>
  );
}
