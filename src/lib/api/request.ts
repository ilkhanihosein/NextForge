import { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiRequestDescriptor, RequestOptions } from "@/lib/api/types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type AxiosConfigWithOptions = InternalAxiosRequestConfig & {
  requestOptions?: RequestOptions;
};

/** Deterministic JSON-ish shape for stable React Query keys (better than string join). */
const stablePart = (value: unknown): unknown => {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(stablePart);
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(entries.map(([k, v]) => [k, stablePart(v)]));
};

const buildQueryKey = (
  method: HttpMethod,
  url: string,
  params: Record<string, unknown> | undefined,
  data: unknown,
): QueryKey => [method, url, stablePart(params ?? {}), stablePart(data)] as QueryKey;

export type CreateRequestOptions = {
  params?: Record<string, unknown>;
  data?: unknown;
  requestOptions?: RequestOptions;
};

export const createRequest = <T>(
  client: AxiosInstance,
  method: HttpMethod,
  url: string,
  options: CreateRequestOptions = {},
): ApiRequestDescriptor<T> => {
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const { params, data, requestOptions } = options;

  const queryKey = buildQueryKey(method, url, params, data);

  const fetch = (): Promise<T> => {
    const config: AxiosConfigWithOptions = {
      method,
      url,
      params,
      data: method !== "GET" ? data : undefined,
      signal: controller?.signal,
      withCredentials: false,
      headers: new AxiosHeaders(),
      requestOptions,
    };
    return client.request<T>(config).then((r) => r.data);
  };

  const cancel = (): void => {
    controller?.abort();
  };

  return { fetch, cancel, queryKey };
};

export type GetConfig = {
  url: string;
  params?: Record<string, unknown>;
  requestOptions?: RequestOptions;
};

export type PostPutConfig = {
  url: string;
  data?: unknown;
  requestOptions?: RequestOptions;
};

export type PostFormDataConfig = {
  url: string;
  formData: FormData;
  requestOptions?: RequestOptions;
};

export type DeleteConfig = {
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  requestOptions?: RequestOptions;
};

const createFormDataRequest = <T>(
  client: AxiosInstance,
  method: HttpMethod,
  url: string,
  formData: FormData,
  options: { requestOptions?: RequestOptions } = {},
): ApiRequestDescriptor<T> => {
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const { requestOptions } = options;
  const queryKey: QueryKey = [method, url, "formData"];

  const fetch = (): Promise<T> => {
    const config: AxiosConfigWithOptions = {
      method,
      url,
      data: formData,
      signal: controller?.signal,
      withCredentials: false,
      headers: new AxiosHeaders(),
      requestOptions,
    };
    return client.request<T>(config).then((r) => r.data);
  };

  const cancel = (): void => {
    controller?.abort();
  };

  return { fetch, cancel, queryKey };
};

/** Builds per-call request descriptors (`api.get`, `api.post`, …) for advanced usage. */
export const createDescriptorClient = (client: AxiosInstance) => ({
  get: <T>(config: GetConfig) =>
    createRequest<T>(client, "GET", config.url, {
      params: config.params,
      requestOptions: config.requestOptions,
    }),

  post: <T>(config: PostPutConfig) =>
    createRequest<T>(client, "POST", config.url, {
      data: config.data,
      requestOptions: config.requestOptions,
    }),

  postFormData: <T>(config: PostFormDataConfig) =>
    createFormDataRequest<T>(client, "POST", config.url, config.formData, {
      requestOptions: config.requestOptions,
    }),

  put: <T>(config: PostPutConfig) =>
    createRequest<T>(client, "PUT", config.url, {
      data: config.data,
      requestOptions: config.requestOptions,
    }),

  patch: <T>(config: PostPutConfig) =>
    createRequest<T>(client, "PATCH", config.url, {
      data: config.data,
      requestOptions: config.requestOptions,
    }),

  delete: <T>(config: DeleteConfig) =>
    createRequest<T>(client, "DELETE", config.url, {
      params: config.params,
      data: config.data,
      requestOptions: config.requestOptions,
    }),
});

export type ApiDescriptorClient = ReturnType<typeof createDescriptorClient>;
