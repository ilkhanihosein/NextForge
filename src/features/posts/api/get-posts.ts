import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { postsQueryPrefix } from "@/lib/api/query-keys";
import type { Post } from "@/features/posts/types/post.types";
import { postsListRequestOptions } from "@/features/posts/api/posts.service";

export const getPosts = (limit: number, signal?: AbortSignal) =>
  http.get<Post[]>("/posts", {
    signal,
    params: { _limit: limit },
    requestOptions: postsListRequestOptions,
  });

/**
 * Uses `postsQueryPrefix` so `invalidateQueries({ queryKey: [...postsQueryPrefix] })` matches this query
 * and descriptor-backed keys. See `docs/data-fetching-and-react-query.md`.
 */
export const postsQueryOptions = (limit: number) =>
  queryOptions({
    queryKey: [...postsQueryPrefix, { _limit: limit }] as const,
    queryFn: ({ signal }) => getPosts(limit, signal),
  });
