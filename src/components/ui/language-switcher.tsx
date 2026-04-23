"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type Locale } from "@/config/site";
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";

const getLocalizedPath = (pathname: string, nextLocale: Locale) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${nextLocale}`;
  segments[0] = nextLocale;
  return `/${segments.join("/")}`;
};

export const LanguageSwitcher = () => {
  const pathname = usePathname();
  const { locale, dictionary } = useAppContext();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-panel/80 p-1 backdrop-blur">
      {siteConfig.locales.map((item) => (
        <Link
          key={item}
          href={getLocalizedPath(pathname, item)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
            item === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label={`${dictionary.common.switchLanguage}: ${item}`}
        >
          {item}
        </Link>
      ))}
    </div>
  );
};
