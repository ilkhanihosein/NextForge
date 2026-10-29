import "server-only";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { cache } from "react";
import { redirect } from "@/i18n/navigation";
import { auth, type Session } from "./auth";
import { isAdminRole } from "../roles";

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

export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (!isAdminRole(session.user.role)) {
    const locale = await getLocale();
    return redirect({ href: "/", locale });
  }
  return session;
}

/** For Route Handlers / actions that should answer 401/403 instead of redirecting. */
export async function authorize(options: { admin?: boolean } = {}) {
  const session = await getSession();
  if (!session) return { session: null, status: 401 as const };
  if (options.admin && !isAdminRole(session.user.role))
    return { session: null, status: 403 as const };
  return { session, status: 200 as const };
}
