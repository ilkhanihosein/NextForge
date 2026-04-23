import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { usersQueryPrefix } from "@/lib/api/query-keys";
import type { User } from "@/features/users/types/user.types";
import { usersListRequestOptions } from "@/features/users/api/users.service";

export const getUserById = (id: number, signal?: AbortSignal) =>
  http.get<User>(`/users/${id}`, {
    signal,
    requestOptions: usersListRequestOptions,
  });

export const userByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: [...usersQueryPrefix, "detail", id] as const,
    queryFn: ({ signal }) => getUserById(id, signal),
  });
