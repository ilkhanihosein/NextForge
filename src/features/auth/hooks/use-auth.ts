"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, AuthError } from "@/lib/api/errors";
import { authMeQueryOptions } from "@/features/auth/api/get-auth-me";
import { clearSession, isAuthenticated } from "@/features/auth/session";

/**
 * Loads the current user via `auth/me` when the session facade reports an access token (`isAuthenticated()` from `@/features/auth/session`).
 *
 * **Return field `isAuthenticated`:** `true` when the `me` query has **user data** — not the same as the facade’s token-only `isAuthenticated()`. See `docs/auth-system.md`.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    ...authMeQueryOptions(),
    enabled: isAuthenticated(),
    retry: false,
  });

  useEffect(() => {
    if (!query.isError || !query.error) return;
    const err = query.error;
    if (err instanceof AuthError || (err instanceof ApiError && err.status === 401)) {
      void clearSession(queryClient);
    }
  }, [query.isError, query.error, queryClient]);

  const isAuth = isAuthenticated();
  const isSessionPending = isAuth && query.isPending;

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    isSessionPending,
    isAuthenticated: Boolean(query.data),
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
