"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/lib/api/token-store";

type UseLogoutOptions = {
  locale: string;
};

export function useLogout({ locale }: UseLogoutOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      tokenStore.clearTokens();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      router.push(`/${locale}`);
      router.refresh();
    },
  });
}
