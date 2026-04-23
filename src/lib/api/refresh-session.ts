import type { ApiTokens } from "@/lib/api/types";

/**
 * Refresh tokens outside the Axios interceptor chain (avoids recursion on 401).
 * Wired into `createApiClient` via `http.ts` → `refreshTokens`.
 */
export async function performTokenRefresh(refreshToken: string): Promise<ApiTokens> {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000");

  const res = await fetch(`${origin}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = (await res.json()) as ApiTokens & {
    accessToken?: string;
    refreshToken?: string | null;
  };
  const tokens: ApiTokens = {
    accessToken: data.accessToken ?? null,
    refreshToken: data.refreshToken ?? null,
  };

  await syncSessionCookiesFromTokens(tokens);
  return tokens;
}

/** Mirrors tokens into HttpOnly cookies for Edge middleware (client-only). */
export async function syncSessionCookiesFromTokens(tokens: ApiTokens) {
  if (typeof window === "undefined") return;
  const origin = window.location.origin;
  const res = await fetch(`${origin}/api/auth/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(tokens),
  });
  if (!res.ok) {
    throw new Error("Session cookie sync failed");
  }
}

export async function clearSessionCookiesClient() {
  if (typeof window === "undefined") return;
  await fetch(`${window.location.origin}/api/auth/session`, {
    method: "DELETE",
    credentials: "same-origin",
  });
}
