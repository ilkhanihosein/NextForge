"use client";

import { useQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "@/features/posts/api/get-posts";

export function usePosts(limit = 10) {
  return useQuery(postsQueryOptions(limit));
}
