"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tokenStore } from "@/lib/api/token-store";
import { ApiError, AuthError } from "@/lib/api/errors";
import { authMeQueryOptions } from "@/features/auth/api/get-auth-me";

const hasBrowserToken = () =>
  typeof window !== "undefined" && Boolean(tokenStore.getAccessToken());

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    ...authMeQueryOptions(),
    enabled: hasBrowserToken(),
    retry: false,
  });

  useEffect(() => {
    if (!query.isError || !query.error) return;
    const err = query.error;
    if (err instanceof AuthError || (err instanceof ApiError && err.status === 401)) {
      tokenStore.clearTokens();
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    }
  }, [query.isError, query.error, queryClient]);

  const isAuthenticated = Boolean(query.data);
  const isSessionPending = hasBrowserToken() && query.isPending;

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    isSessionPending,
    isAuthenticated,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
