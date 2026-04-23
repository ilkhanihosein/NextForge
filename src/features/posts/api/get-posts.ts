/**
 * Uses `postsQueryPrefix` so `invalidateQueries({ queryKey: [...postsQueryPrefix] })` matches this query
 * and descriptor-backed keys. For a minimal `http.get` example without prefixes, see `docs/api-layer.md`.
 */
import { queryOptions, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { postsQueryPrefix } from "@/lib/api/query-keys";
import type { Post } from "@/features/posts/api/posts.service";

export const postsQueryOptions = (limit: number) =>
  queryOptions({
    queryKey: [...postsQueryPrefix, { _limit: limit }] as const,
    queryFn: ({ signal }) =>
      http.get<Post[]>("/posts", {
        signal,
        params: { _limit: limit },
      }),
  });

export const usePostsQuery = () => {
  return useQuery(postsQueryOptions(3));
};
