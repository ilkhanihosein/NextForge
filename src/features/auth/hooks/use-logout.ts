"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clearSession } from "@/features/auth/session";

type UseLogoutOptions = {
  locale: string;
};

export function useLogout({ locale }: UseLogoutOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await clearSession(queryClient);
    },
    onSuccess: () => {
      router.push(`/${locale}`);
      router.refresh();
    },
  });
}
