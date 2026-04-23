"use client";

import { useQuery } from "@tanstack/react-query";
import { userByIdQueryOptions } from "@/features/users/api/get-user-by-id";

export function useUser(id: number | undefined) {
  const safeId =
    typeof id === "number" && Number.isFinite(id) && id > 0 ? Math.floor(id) : 0;

  return useQuery({
    ...userByIdQueryOptions(safeId),
    enabled: safeId > 0,
  });
}
