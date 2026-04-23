import type { AxiosRequestConfig } from "axios";
import type { QueryKey } from "@tanstack/react-query";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiPrimitive = string | number | boolean | null | undefined;
export type ApiParams = Record<string, ApiPrimitive | ApiPrimitive[]>;

export type ApiErrorPayload = {
  message: string;
  code?: string | number;
  status: number;
  details?: unknown;
  fieldErrors?: Record<string, string[]>;
};

export type ApiTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type RefreshTokensFn = (refreshToken: string) => Promise<ApiTokens>;

/**
 * Per-request flags (passed as `requestOptions` on `http.*` or inside descriptor configs).
 *
 * **Common:** `secure`, `skipAuthRefresh`, `sendAppHeaders`.
 * **Less common:** `sendCartUuid` (needs `getCartUuid` on the client factory); full table in **`docs/api-layer.md`** (*RequestOptions (full reference)*).
 */
export type RequestOptions = {
  secure?: boolean;
  sendAppHeaders?: boolean;
  sendCartUuid?: boolean;
  skipAuthRefresh?: boolean;
};

export type ApiClientConfig = {
  baseURL: string;
  timeoutMs?: number;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  setTokens?: (tokens: ApiTokens) => void;
  clearTokens?: () => void;
  refreshTokens?: RefreshTokensFn;
  onAuthFailure?: () => void;
  /** Optional: cart/session id for `sendCartUuid` requests. */
  getCartUuid?: () => Promise<string | null> | string | null;
  /** Sent as `Accept-Language` / `language` when `sendAppHeaders` is on. */
  getLocaleHeader?: () => string | null;
  /** Sent as `X-Country` when `sendAppHeaders` is on. */
  getCountryCode?: () => string | null;
  /** Default `Web` — sent as `os` header. */
  osLabel?: string;
};

export type RequestConfig<TBody = unknown> = {
  url: string;
  method: HttpMethod;
  params?: ApiParams;
  data?: TBody;
  signal?: AbortSignal;
  headers?: AxiosRequestConfig["headers"];
  requestOptions?: RequestOptions;
};

/** One logical HTTP call: data loader, AbortController-backed cancel, and matching TanStack `queryKey`. */
export type ApiRequestDescriptor<T> = {
  fetch: () => Promise<T>;
  cancel: () => void;
  queryKey: QueryKey;
};
