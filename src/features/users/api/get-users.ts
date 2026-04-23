import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { usersQueryPrefix } from "@/lib/api/query-keys";
import type { User } from "@/features/users/types/user.types";
import { usersListRequestOptions } from "@/features/users/api/users.service";

export const getUsers = (limit: number, signal?: AbortSignal) =>
  http.get<User[]>("/users", {
    signal,
    params: { _limit: limit },
    requestOptions: usersListRequestOptions,
  });

/**
 * Uses `usersQueryPrefix` so `invalidateQueries({ queryKey: [...usersQueryPrefix] })` matches this query
 * and descriptor-backed keys. See `docs/data-fetching-and-react-query.md`.
 */
export const usersQueryOptions = (limit: number) =>
  queryOptions({
    queryKey: [...usersQueryPrefix, { _limit: limit }] as const,
    queryFn: ({ signal }) => getUsers(limit, signal),
  });
