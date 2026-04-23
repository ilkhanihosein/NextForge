import type { QueryClient } from "@tanstack/react-query";
import type { ApiTokens } from "@/lib/api/types";
import {
  clearSessionCookiesClient,
  syncSessionCookiesFromTokens,
} from "@/lib/api/refresh-session";
import { tokenStore } from "@/lib/api/token-store";
import { authMeQueryOptions } from "@/features/auth/api/get-auth-me";
import type { AuthUser } from "@/features/auth/types/auth.types";

export type AuthSessionSnapshot = {
  accessToken: string | null;
  refreshToken: string | null;
  /** True when an access token exists in the client token store (same signal as React Query `auth/me` enabled). */
  hasAccessToken: boolean;
};

/**
 * Single coordination point for session lifecycle in feature code.
 * Under the hood: `tokenStore` + existing cookie sync utilities (middleware unchanged).
 */
export function getSession(): AuthSessionSnapshot {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null, hasAccessToken: false };
  }
  const accessToken = tokenStore.getAccessToken();
  const refreshToken = tokenStore.getRefreshToken();
  return {
    accessToken,
    refreshToken,
    hasAccessToken: Boolean(accessToken),
  };
}

export function isAuthenticated(): boolean {
  return getSession().hasAccessToken;
}

export async function setSession(
  tokens: ApiTokens,
  user?: AuthUser,
  queryClient?: QueryClient,
): Promise<void> {
  tokenStore.setTokens(tokens);
  await syncSessionCookiesFromTokens(tokens);
  if (user && queryClient) {
    queryClient.setQueryData(authMeQueryOptions().queryKey, user);
  }
}

export async function clearSession(queryClient?: QueryClient): Promise<void> {
  await clearSessionCookiesClient();
  tokenStore.clearTokens();
  queryClient?.removeQueries({ queryKey: authMeQueryOptions().queryKey });
}

/** Mirrors stored tokens into HttpOnly cookies (bootstrap / upgrade path). */
export async function ensureSessionCookiesFromStore(): Promise<void> {
  const { accessToken, refreshToken } = getSession();
  if (!accessToken) return;
  await syncSessionCookiesFromTokens({
    accessToken,
    refreshToken,
  });
}
