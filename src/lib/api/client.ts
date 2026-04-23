import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { CONTENT_TYPES, HEADERS } from "@/lib/api/constants";
import {
  ApiError,
  AuthError,
  normalizeErrorPayload,
  toApiError,
  toAuthError,
} from "@/lib/api/errors";
import { serializeParams } from "@/lib/api/serialize-params";
import type {
  ApiClientConfig,
  ApiTokens,
  RequestConfig,
  RequestOptions,
} from "@/lib/api/types";

type InternalConfig = InternalAxiosRequestConfig & {
  requestOptions?: RequestOptions;
  _refreshAttempted?: boolean;
  _networkRetried?: boolean;
};

const getRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeoutMs ?? 30_000,
    headers: {
      [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
      [HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
    },
    withCredentials: false,
    paramsSerializer: {
      serialize: (params) => serializeParams((params ?? {}) as Record<string, unknown>),
    },
  });

  let isRefreshing = false;
  let refreshQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
  }> = [];

  const flushRefreshQueue = (error: unknown, token: string | null) => {
    refreshQueue.forEach((entry) => {
      if (error) entry.reject(error);
      else entry.resolve(token);
    });
    refreshQueue = [];
  };

  client.interceptors.request.use(async (request) => {
    const req = request as InternalConfig;
    const opts = req.requestOptions ?? {};
    const secure = opts.secure !== false;
    const sendAppHeaders = opts.sendAppHeaders !== false;

    req.withCredentials = false;

    if (req.data instanceof FormData) {
      req.headers.delete(HEADERS.CONTENT_TYPE);
    }

    if (!sendAppHeaders) {
      req.headers.delete(HEADERS.OS);
    }

    if (secure) {
      const token = config.getAccessToken?.();
      if (token) {
        req.headers.set(HEADERS.AUTHORIZATION, `Bearer ${token}`);
      }
    }

    if (opts.sendCartUuid && config.getCartUuid) {
      const raw = config.getCartUuid();
      const cartUuid = raw instanceof Promise ? await raw : raw;
      if (cartUuid) {
        req.headers.set(HEADERS.CART_UUID, cartUuid);
      }
    }

    if (sendAppHeaders) {
      req.headers.set(HEADERS.OS, config.osLabel ?? "Web");
      const locale = config.getLocaleHeader?.();
      if (locale) {
        req.headers.set(HEADERS.ACCEPT_LANGUAGE, locale);
        req.headers.set(HEADERS.LANGUAGE, locale);
        req.headers.set(HEADERS.LANGUAGES, locale);
      }
      const country = config.getCountryCode?.();
      if (country) {
        req.headers.set(HEADERS.X_COUNTRY, country);
      }
    }

    req.headers.set("x-request-id", getRequestId());
    return req;
  });

  client.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: AxiosError) => {
      const httpResponse = error.response;
      const originalRequest = error.config as InternalConfig | undefined;

      if (!httpResponse) {
        const isNetworkError =
          error.code === "ECONNABORTED" ||
          error.code === "ERR_NETWORK" ||
          error.message === "Network Error";

        if (isNetworkError && originalRequest && !originalRequest._networkRetried) {
          originalRequest._networkRetried = true;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          try {
            return await client.request(originalRequest);
          } catch {
            // fall through
          }
        }

        throw new ApiError({
          message: error.message || "Network request failed",
          status: 0,
          code: "NETWORK_ERROR",
        });
      }

      const status = httpResponse.status;
      const payload = normalizeErrorPayload({
        status,
        data: httpResponse.data,
      });

      if (status === 412) {
        config.clearTokens?.();
        config.onAuthFailure?.();
        return Promise.reject(
          toAuthError(
            412,
            payload.message ?? "Precondition Failed",
            "precondition_failed",
          ),
        );
      }

      const isAuthStatus = status === 401 || status === 403;
      const canRefresh =
        isAuthStatus &&
        originalRequest &&
        !originalRequest._refreshAttempted &&
        !originalRequest.requestOptions?.skipAuthRefresh &&
        Boolean(config.refreshTokens) &&
        Boolean(config.getRefreshToken);

      if (canRefresh && originalRequest) {
        originalRequest._refreshAttempted = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({
              resolve: (token) => {
                if (!token) {
                  return reject(toAuthError(status, "Session expired", "refresh_failed"));
                }
                originalRequest.headers.set(HEADERS.AUTHORIZATION, `Bearer ${token}`);
                resolve(client.request(originalRequest));
              },
              reject,
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshToken = config.getRefreshToken?.();
          if (!refreshToken || !config.refreshTokens) {
            throw new AuthError("Refresh token missing", status, "no_refresh_token");
          }

          const tokens: ApiTokens = await config.refreshTokens(refreshToken);
          config.setTokens?.(tokens);
          flushRefreshQueue(null, tokens.accessToken);

          if (tokens.accessToken) {
            originalRequest.headers.set(
              HEADERS.AUTHORIZATION,
              `Bearer ${tokens.accessToken}`,
            );
          }

          return client.request(originalRequest);
        } catch (refreshError) {
          config.clearTokens?.();
          config.onAuthFailure?.();
          flushRefreshQueue(refreshError, null);
          const authErr =
            refreshError instanceof AuthError
              ? refreshError
              : toAuthError(
                  status,
                  refreshError instanceof Error ? refreshError.message : "Refresh failed",
                  "refresh_failed",
                );
          return Promise.reject(authErr);
        } finally {
          isRefreshing = false;
        }
      }

      if (isAuthStatus) {
        return Promise.reject(
          toAuthError(status, payload.message ?? "Unauthorized", "unauthorized"),
        );
      }

      return Promise.reject(toApiError(status, payload));
    },
  );

  return client;
};

/** Typed thin wrapper around `client.request` → response `data` as `Promise<T>`. */
export const createHttp = (client: AxiosInstance) => ({
  request: async <TResponse, TBody = unknown>(request: RequestConfig<TBody>) => {
    const response = await client.request<TResponse>({
      method: request.method,
      url: request.url,
      params: request.params,
      data: request.data,
      signal: request.signal,
      headers: request.headers,
      requestOptions: request.requestOptions,
    } as InternalConfig);

    return response.data;
  },

  get: <TResponse>(
    url: string,
    options?: Omit<RequestConfig<never>, "url" | "method" | "data">,
  ) =>
    client
      .request<TResponse>({
        method: "GET",
        url,
        params: options?.params,
        signal: options?.signal,
        headers: options?.headers,
        requestOptions: options?.requestOptions,
      } as InternalConfig)
      .then((res) => res.data),

  post: <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: Omit<RequestConfig<TBody>, "url" | "method" | "data">,
  ) =>
    client
      .request<TResponse>({
        method: "POST",
        url,
        data,
        signal: options?.signal,
        headers: options?.headers,
        requestOptions: options?.requestOptions,
      } as InternalConfig)
      .then((res) => res.data),

  put: <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: Omit<RequestConfig<TBody>, "url" | "method" | "data">,
  ) =>
    client
      .request<TResponse>({
        method: "PUT",
        url,
        data,
        signal: options?.signal,
        headers: options?.headers,
        requestOptions: options?.requestOptions,
      } as InternalConfig)
      .then((res) => res.data),

  patch: <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: Omit<RequestConfig<TBody>, "url" | "method" | "data">,
  ) =>
    client
      .request<TResponse>({
        method: "PATCH",
        url,
        data,
        signal: options?.signal,
        headers: options?.headers,
        requestOptions: options?.requestOptions,
      } as InternalConfig)
      .then((res) => res.data),

  delete: <TResponse, TBody = unknown>(
    url: string,
    options?: Omit<RequestConfig<TBody>, "url" | "method">,
  ) =>
    client
      .request<TResponse>({
        method: "DELETE",
        url,
        data: options?.data,
        params: options?.params,
        signal: options?.signal,
        headers: options?.headers,
        requestOptions: options?.requestOptions,
      } as InternalConfig)
      .then((res) => res.data),
});
