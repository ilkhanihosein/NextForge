import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { postsQueryPrefix } from "@/lib/api/query-keys";
import type { Post } from "@/features/posts/types/post.types";
import { postsListRequestOptions } from "@/features/posts/api/posts.service";

export const getPostById = (id: number, signal?: AbortSignal) =>
  http.get<Post>(`/posts/${id}`, {
    signal,
    requestOptions: postsListRequestOptions,
  });

export const postByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: [...postsQueryPrefix, "detail", id] as const,
    queryFn: ({ signal }) => getPostById(id, signal),
  });
