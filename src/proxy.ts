import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import { AUTH_ACCESS_COOKIE, isDemoAccessToken } from "@/lib/auth/session-cookies";

const PUBLIC_FILE = /\.(.*)$/;

const protectedRestPaths = ["/profile", "/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const matchedLocale = siteConfig.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (matchedLocale) {
    const prefix = `/${matchedLocale}`;
    const rest = pathname === prefix ? "/" : pathname.slice(prefix.length);

    if (!rest.startsWith("/login")) {
      const isProtected = protectedRestPaths.some(
        (p) => rest === p || rest.startsWith(`${p}/`),
      );
      if (isProtected) {
        const access = request.cookies.get(AUTH_ACCESS_COOKIE)?.value;
        if (!isDemoAccessToken(access)) {
          const loginUrl = request.nextUrl.clone();
          loginUrl.pathname = `${prefix}/login`;
          loginUrl.searchParams.set("from", pathname);
          return NextResponse.redirect(loginUrl);
        }
      }
    }

    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${siteConfig.defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
