import "server-only";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { cache } from "react";
import { redirect } from "@/i18n/navigation";
import { auth, type Session } from "./auth";
import { isAdminRole, isOwnerRole } from "../roles";

/** Request-scoped: any number of components can ask for the session, one lookup happens. */
export const getSession = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * The real authorization gate. The proxy only does an optimistic cookie check for fast
 * redirects; every protected page, action and route handler must call one of these.
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    const locale = await getLocale();
    return redirect({ href: "/login", locale });
  }
  return session;
}

/**
 * Skips the 5-minute session cookie cache and reads the database, so a suspension, a
 * removed admin right or a revoked session stops admin access on the very next request.
 */
const getFreshSession = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
});

export async function requireAdmin(): Promise<Session> {
  const session = await getFreshSession();
  if (!session || !isAdminRole(session.user.role)) {
    const locale = await getLocale();
    return redirect({ href: session ? "/" : "/login", locale });
  }
  return session;
}

/** Owner-only screens (activity log). */
export async function requireOwner(): Promise<Session> {
  const session = await requireAdmin();
  if (!isOwnerRole(session.user.role)) {
    const locale = await getLocale();
    return redirect({ href: "/admin", locale });
  }
  return session;
}

/** For Route Handlers / actions that should answer 401/403 instead of redirecting. */
export async function authorize(options: { admin?: boolean } = {}) {
  const session = options.admin ? await getFreshSession() : await getSession();
  if (!session) return { session: null, status: 401 as const };
  if (options.admin && !isAdminRole(session.user.role))
    return { session: null, status: 403 as const };
  return { session, status: 200 as const };
}
