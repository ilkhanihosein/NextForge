import { routing } from "./routing";

/** Strips the locale prefix: "/fa/admin" → "/admin", "/admin" → "/admin". */
export function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Locale of a raw pathname, falling back to the default. */
export function localeFromPath(pathname: string) {
  return (
    routing.locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)) ??
    routing.defaultLocale
  );
}

/** Builds a path for a locale following the "as-needed" prefix rule. */
export function localizedPath(pathname: string, locale: string) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === routing.defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
