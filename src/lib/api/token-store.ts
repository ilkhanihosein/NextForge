import type { ApiTokens } from "@/lib/api/types";

const ACCESS_TOKEN_KEY = "app.access_token";
const REFRESH_TOKEN_KEY = "app.refresh_token";

const isBrowser = typeof window !== "undefined";

let memoryTokens: ApiTokens = {
  accessToken: null,
  refreshToken: null,
};

export const tokenStore = {
  getAccessToken: (): string | null => {
    if (isBrowser) return localStorage.getItem(ACCESS_TOKEN_KEY);
    return memoryTokens.accessToken;
  },

  getRefreshToken: (): string | null => {
    if (isBrowser) return localStorage.getItem(REFRESH_TOKEN_KEY);
    return memoryTokens.refreshToken;
  },

  setTokens: (tokens: ApiTokens) => {
    memoryTokens = tokens;
    if (!isBrowser) return;

    if (tokens.accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);

    if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearTokens: () => {
    memoryTokens = { accessToken: null, refreshToken: null };
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
