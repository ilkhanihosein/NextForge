import type { AuthUser } from "@/features/auth/types/auth.types";

export const ACCESS_PREFIX = "demo.";
export const REFRESH_PREFIX = "rfr.";

export const encodeAccessToken = (user: AuthUser) =>
  `${ACCESS_PREFIX}${Buffer.from(JSON.stringify({ user }), "utf8").toString("base64url")}`;

export const decodeAccessToken = (token: string): AuthUser | null => {
  if (!token.startsWith(ACCESS_PREFIX)) return null;
  try {
    const json = Buffer.from(token.slice(ACCESS_PREFIX.length), "base64url").toString(
      "utf8",
    );
    const parsed = JSON.parse(json) as { user?: AuthUser };
    return parsed.user ?? null;
  } catch {
    return null;
  }
};

type RefreshPayload = {
  sub: number;
  role: AuthUser["role"];
  v: number;
};

export const encodeRefreshToken = (payload: RefreshPayload) =>
  `${REFRESH_PREFIX}${Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")}`;

export const decodeRefreshToken = (token: string): RefreshPayload | null => {
  if (!token.startsWith(REFRESH_PREFIX)) return null;
  try {
    const json = Buffer.from(token.slice(REFRESH_PREFIX.length), "base64url").toString(
      "utf8",
    );
    return JSON.parse(json) as RefreshPayload;
  } catch {
    return null;
  }
};

export const demoUserFromPayload = (payload: RefreshPayload): AuthUser => ({
  id: payload.sub,
  email: "demo@example.com",
  name: "Demo User",
  role: payload.role,
});
