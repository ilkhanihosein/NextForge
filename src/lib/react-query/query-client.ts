import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { isCancel } from "axios";
import { ApiError, AuthError } from "@/lib/api";
import { errorToastDescription } from "@/lib/react-query/error-toast-message";
import "@/lib/react-query/register";
import { appToast } from "@/lib/toast";

const shouldRetry = (failureCount: number, error: unknown) => {
  if (isCancel(error)) return false;
  if (error instanceof AuthError) return false;
  if (error instanceof ApiError) {
    if (error.status >= 400 && error.status < 500) return false;
  }
  return failureCount < 2;
};

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isCancel(error)) return;
        if (error instanceof AuthError) return;
        if (query.meta?.suppressErrorToast) return;
        appToast.error({
          title: query.meta?.errorToastTitle ?? "Request failed",
          description: errorToastDescription(error),
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (isCancel(error)) return;
        if (error instanceof AuthError) return;
        if (mutation.meta?.suppressErrorToast) return;
        appToast.error({
          title: mutation.meta?.errorToastTitle ?? "Action failed",
          description: errorToastDescription(error),
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 2 * 60_000,
        gcTime: 10 * 60_000,
        retry: shouldRetry,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8_000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: (failureCount, error) => shouldRetry(failureCount, error),
      },
    },
  });
