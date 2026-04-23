import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { authAppUrl } from "@/features/auth/api/auth-app-url";
import type { AuthUser } from "@/features/auth/types/auth.types";

/** Skip refresh-queue retry for invalid session — surface 401 to React Query. */
const authMeRequestOptions = { skipAuthRefresh: true } as const;

export const getAuthMe = (signal?: AbortSignal) =>
  http.get<AuthUser>(authAppUrl("/api/auth/me"), {
    signal,
    requestOptions: authMeRequestOptions,
  });

export const authMeQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "me"] as const,
    queryFn: ({ signal }) => getAuthMe(signal),
  });
