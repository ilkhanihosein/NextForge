"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAppContext } from "@/context/app-context";
import type { Locale } from "@/config/site";

type AuthNavProps = {
  locale: Locale;
};

/** Stable shell so SSR and the first client paint match (no token on server, token + pending on client). */
function AuthNavPlaceholder() {
  return (
    <span
      className="inline-block h-9 min-w-[5.5rem] rounded-lg bg-muted/25"
      aria-hidden
    />
  );
}

export function AuthNav({ locale }: AuthNavProps) {
  const { dictionary } = useAppContext();
  const a = dictionary.auth;
  const base = `/${locale}`;
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated, isSessionPending, user } = useAuth();
  const logout = useLogout({ locale });

  // Defer after paint so SSR and first paint match; microtask avoids setState-in-effect lint false positive.
  useEffect(() => {
    queueMicrotask(() => {
      setHydrated(true);
    });
  }, []);

  if (!hydrated) {
    return <AuthNavPlaceholder />;
  }

  if (isSessionPending) {
    return (
      <span
        className="rounded-lg px-2 py-1 text-xs text-muted-foreground"
        aria-live="polite"
      >
        {a.sessionLoading}
      </span>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`${base}/login`}
        className="rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {a.navLogin}
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {user?.role === "admin" ? (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand"
          title={a.adminBadgeTitle}
        >
          <Shield className="h-3 w-3" aria-hidden />
          {a.adminBadge}
        </span>
      ) : null}
      {user?.role === "admin" ? (
        <Link
          href={`${base}/dashboard`}
          className="rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {a.navDashboard}
        </Link>
      ) : null}
      <Link
        href={`${base}/profile`}
        className="max-w-[10rem] truncate rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        title={user?.email}
      >
        {user?.name ?? a.navProfile}
      </Link>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        {logout.isPending ? a.loggingOut : a.navLogout}
      </button>
    </div>
  );
}
