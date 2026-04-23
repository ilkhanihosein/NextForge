import { createApiClient, createHttp } from "@/lib/api/client";
import { createDescriptorClient } from "@/lib/api/request";
import { BASE_URLS } from "@/lib/api/constants";
import { tokenStore } from "@/lib/api/token-store";
import type { ApiTokens } from "@/lib/api/types";

const refreshTokens = async (_refreshToken: string): Promise<ApiTokens> => {
  void _refreshToken;
  return {
    accessToken: tokenStore.getAccessToken(),
    refreshToken: tokenStore.getRefreshToken(),
  };
};

const sharedClientConfig = {
  timeoutMs: 30_000,
  getAccessToken: tokenStore.getAccessToken,
  getRefreshToken: tokenStore.getRefreshToken,
  setTokens: tokenStore.setTokens,
  clearTokens: tokenStore.clearTokens,
  refreshTokens,
};

export const apiClient = createApiClient({
  baseURL: BASE_URLS.default,
  ...sharedClientConfig,
});

const coreBase = BASE_URLS.core;
export const coreApiClient =
  coreBase === BASE_URLS.default
    ? apiClient
    : createApiClient({ baseURL: coreBase, ...sharedClientConfig });

/** Direct `get` / `post` / … → `Promise<T>`. Best default for `queryFn` / `mutationFn`. */
export const http = createHttp(apiClient);
export const coreHttp = createHttp(coreApiClient);

/**
 * Request-descriptor client: each call returns `{ fetch, cancel, queryKey }` so cache keys and network stay aligned.
 * Optional; use when you need explicit cancellation or the descriptor shape (see docs).
 */
export const api = createDescriptorClient(apiClient);
export const coreApi = createDescriptorClient(coreApiClient);
