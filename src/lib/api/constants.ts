/** HTTP verbs (for logging or descriptors). */
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

/** Canonical header names (single source of truth for the API layer). */
export const HEADERS = {
  ACCEPT: "Accept",
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT_LANGUAGE: "Accept-Language",
  CART_UUID: "Cart-UUID",
  X_COUNTRY: "X-Country",
  LANGUAGE: "language",
  LANGUAGES: "languages",
  OS: "os",
} as const;

export const CONTENT_TYPES = {
  JSON: "application/json",
} as const;

/** Relative refresh path when you implement refresh against this API base. */
export const REFRESH_PATH = "/auth/refresh";

const defaultBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://jsonplaceholder.typicode.com";

const coreBase =
  process.env.NEXT_PUBLIC_API_CORE_URL && process.env.NEXT_PUBLIC_API_CORE_URL.length > 0
    ? process.env.NEXT_PUBLIC_API_CORE_URL
    : defaultBase;

/** Base URLs for one or two backends (second falls back to first if unset). */
export const BASE_URLS = {
  default: defaultBase,
  core: coreBase,
} as const;

export type BaseUrlKey = keyof typeof BASE_URLS;
