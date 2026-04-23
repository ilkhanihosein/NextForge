import type { ApiTokens } from "@/lib/api/types";

/** Cookie names mirrored for Edge middleware + Route Handlers (must stay in sync). */
export const AUTH_ACCESS_COOKIE = "auth_at";
export const AUTH_REFRESH_COOKIE = "auth_rt";

const isProd = process.env.NODE_ENV === "production";

const cookieBase = (name: string, value: string, maxAgeSeconds: number) =>
  `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${isProd ? "; Secure" : ""}`;

const clearCookie = (name: string) =>
  `${name}=; Path=/; Max-Age=0; SameSite=Lax${isProd ? "; Secure" : ""}`;

/** Sets HttpOnly session cookies (middleware gate). Called from Route Handlers only. */
export function appendAuthCookieHeaders(headers: Headers, tokens: ApiTokens) {
  const maxAge = 60 * 60 * 24 * 7;
  if (tokens.accessToken) {
    headers.append(
      "Set-Cookie",
      `${cookieBase(AUTH_ACCESS_COOKIE, tokens.accessToken, maxAge)}; HttpOnly`,
    );
  }
  if (tokens.refreshToken) {
    headers.append(
      "Set-Cookie",
      `${cookieBase(AUTH_REFRESH_COOKIE, tokens.refreshToken, maxAge)}; HttpOnly`,
    );
  }
}

export function appendClearAuthCookieHeaders(headers: Headers) {
  headers.append("Set-Cookie", `${clearCookie(AUTH_ACCESS_COOKIE)}; HttpOnly`);
  headers.append("Set-Cookie", `${clearCookie(AUTH_REFRESH_COOKIE)}; HttpOnly`);
}

export function isDemoAccessToken(value: string | undefined) {
  return Boolean(value && value.startsWith("demo."));
}
