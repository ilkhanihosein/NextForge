"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setSession } from "@/features/auth/session";
import type { LoginRequest } from "@/features/auth/types/auth.types";
import { loginWithPassword } from "@/features/auth/api/login-api";

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
    onSuccess: async (data) => {
      await setSession(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data.user,
        queryClient,
      );
      const target = redirectTo ?? `/${locale}/profile`;
      router.push(target);
    },
  });
}
