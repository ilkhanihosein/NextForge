import { queryOptions, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import { usersQueryPrefix } from "@/lib/api/query-keys";
import type { User } from "@/features/users/api/users.types";

export const usersQueryOptions = (limit: number) =>
  queryOptions({
    queryKey: [...usersQueryPrefix, { _limit: limit }] as const,
    queryFn: ({ signal }) =>
      http.get<User[]>("/users", {
        signal,
        params: { _limit: limit },
      }),
  });

export const useUsersQuery = (limit = 3) => {
  return useQuery(usersQueryOptions(limit));
};
