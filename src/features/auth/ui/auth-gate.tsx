"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { tokenStore } from "@/lib/api/token-store";
import { useAppContext } from "@/context/app-context";

type AuthGateProps = {
  locale: string;
  children: React.ReactNode;
};

const subscribeNoop = () => () => {};

export function AuthGate({ locale, children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { dictionary } = useAppContext();
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const { isAuthenticated, isSessionPending, isLoading } = useAuth();
  const hasToken = isClient && Boolean(tokenStore.getAccessToken());

  useEffect(() => {
    if (!isClient) return;
    if (!hasToken) {
      const from = encodeURIComponent(pathname ?? `/${locale}/profile`);
      router.replace(`/${locale}/login?from=${from}`);
    }
  }, [hasToken, isClient, locale, pathname, router]);

  if (!isClient) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-8" aria-busy="true">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto mt-4 h-4 w-2/3 max-w-sm animate-pulse rounded bg-muted/80" />
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-8 text-center text-sm text-muted-foreground">
        {dictionary.auth.redirecting}
      </div>
    );
  }

  if (isLoading || isSessionPending) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-8" aria-busy="true">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto mt-4 h-4 w-2/3 max-w-sm animate-pulse rounded bg-muted/80" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-8 text-center text-sm text-muted-foreground">
        {dictionary.auth.redirecting}
      </div>
    );
  }

  return <>{children}</>;
}
