"use client";

import { useQuery } from "@tanstack/react-query";
import { postByIdQueryOptions } from "@/features/posts/api/get-post-by-id";

export function usePost(id: number | undefined) {
  const safeId =
    typeof id === "number" && Number.isFinite(id) && id > 0 ? Math.floor(id) : 0;

  return useQuery({
    ...postByIdQueryOptions(safeId),
    enabled: safeId > 0,
  });
}
