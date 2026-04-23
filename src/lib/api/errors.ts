import type { ApiErrorPayload } from "@/lib/api/types";

export class ApiError extends Error {
  status: number;
  code?: string | number;
  details?: unknown;
  fieldErrors?: Record<string, string[]>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
    this.fieldErrors = payload.fieldErrors;
  }
}

export class AuthError extends ApiError {
  readonly reasonCode: string;

  constructor(
    message = "Authentication required",
    status = 401,
    reasonCode: string = "unauthorized",
  ) {
    super({ message, status, code: reasonCode });
    this.name = "AuthError";
    this.reasonCode = reasonCode;
  }
}

export type NormalizedErrorPayload = {
  message?: string;
  code?: number;
  details?: string;
  errors?: Record<string, string[]>;
};

/** Normalize many backend JSON shapes (flat, nested `meta`, Laravel-style). */
export const normalizeErrorPayload = (response?: {
  status: number;
  data?: unknown;
}): NormalizedErrorPayload => {
  if (!response?.data || typeof response.data !== "object") {
    return {};
  }
  const d = response.data as Record<string, unknown>;
  const meta = d.meta as Record<string, unknown> | undefined;
  return {
    message:
      (meta?.message as string) ??
      (d.message as string) ??
      (d.error as string) ??
      (d.detail as string),
    code: (meta?.code as number) ?? (d.code as number) ?? undefined,
    details: (meta?.details as string) ?? (d.details as string) ?? undefined,
    errors:
      (meta?.errors as Record<string, string[]>) ??
      (d.errors as Record<string, string[]>) ??
      undefined,
  };
};

export const toApiError = (status: number, payload: NormalizedErrorPayload): ApiError => {
  const message =
    payload.message ?? payload.details ?? `Request failed with status ${status}`;
  return new ApiError({
    message,
    status,
    code: payload.code ?? status,
    details: payload.details,
    fieldErrors: payload.errors,
  });
};

export const toAuthError = (
  status: number,
  message: string,
  code = "unauthorized",
): AuthError => {
  return new AuthError(message, status, code);
};

/** Legacy normalizer — prefer `normalizeErrorPayload` + `toApiError` for HTTP responses. */
export const normalizeApiError = (status: number, payload: unknown): ApiError => {
  return toApiError(status, normalizeErrorPayload({ status, data: payload }));
};
