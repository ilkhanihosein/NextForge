"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/lib/api/token-store";
import { loginWithPassword } from "@/features/auth/api/login-api";
import { authMeQueryOptions } from "@/features/auth/api/get-auth-me";
import type { LoginRequest } from "@/features/auth/types/auth.types";

type UseLoginOptions = {
  locale: string;
  /** Path to navigate after success (e.g. `/en/profile`). */
  redirectTo?: string;
};

export function useLogin({ locale, redirectTo }: UseLoginOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginRequest) => loginWithPassword(input),
    onSuccess: (data) => {
      tokenStore.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      queryClient.setQueryData(authMeQueryOptions().queryKey, data.user);
      const target = redirectTo ?? `/${locale}/profile`;
      router.push(target);
    },
  });
}
