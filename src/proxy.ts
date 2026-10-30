import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { matchesRoute, privateRoutes, protectedRoutes } from "@/config/routes";
import { localeFromPath, localizedPath, stripLocale } from "@/i18n/paths";
import { routing } from "@/i18n/routing";

const intl = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const path = stripLocale(pathname);

  // Optimistic gate: cookie presence only, no DB call. Authorization happens server-side.
  if (matchesRoute(path, protectedRoutes) && !getSessionCookie(request)) {
    const url = new URL(localizedPath("/login", localeFromPath(pathname)), request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  const response = intl(request);
  if (matchesRoute(path, privateRoutes))
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
