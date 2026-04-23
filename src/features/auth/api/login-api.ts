import { http } from "@/lib/api/http";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth.types";
import { authAppUrl } from "@/features/auth/api/auth-app-url";

/** Login must not send `Authorization` or trigger refresh on 401. */
export const authLoginRequestOptions = { secure: false, skipAuthRefresh: true } as const;

export const loginWithPassword = (body: LoginRequest, signal?: AbortSignal) =>
  http.post<LoginResponse, LoginRequest>(authAppUrl("/api/auth/login"), body, {
    signal,
    requestOptions: authLoginRequestOptions,
  });
