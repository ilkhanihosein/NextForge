import { api } from "@/lib/api/http";
import type { Post } from "@/features/posts/types/post.types";

/** Unauthenticated list reads: no Bearer header, no refresh retry on 401/403. */
export const postsListRequestOptions = { secure: false, skipAuthRefresh: true } as const;

export const postsService = {
  /**
   * Request descriptor from `api.get`: pairs a stable TanStack `queryKey` with `fetch` + `cancel`.
   * Use with React Query when you want keyed fetch/cancel in one object (see API docs — Advanced).
   */
  listDescriptor: (limit = 3) =>
    api.get<Post[]>({
      url: "/posts",
      params: { _limit: limit },
      requestOptions: postsListRequestOptions,
    }),

  /** Promise-only helper; prefer `http.get` in `queryFn` for the usual case. */
  getList: (limit = 3) => postsService.listDescriptor(limit).fetch(),
};
