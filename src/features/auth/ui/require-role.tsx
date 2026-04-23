"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import type { AuthRole } from "@/features/auth/types/auth.types";
import { useAppContext } from "@/context/app-context";

type RequireRoleProps = {
  role: AuthRole;
  children: React.ReactNode;
};

export function RequireRole({ role, children }: RequireRoleProps) {
  const { dictionary } = useAppContext();
  const { user, isSessionPending, isAuthenticated } = useAuth();

  if (isSessionPending || !isAuthenticated) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-8" aria-busy="true">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (user?.role !== role) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
      >
        {dictionary.auth.forbiddenRole}
      </div>
    );
  }

  return <>{children}</>;
}
