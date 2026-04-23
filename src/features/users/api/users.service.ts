import { api } from "@/lib/api/http";
import type { User } from "@/features/users/types/user.types";

/** Unauthenticated list reads: no Bearer header, no refresh retry on 401/403. */
export const usersListRequestOptions = { secure: false, skipAuthRefresh: true } as const;

export const usersService = {
  /**
   * Request descriptor: stable `queryKey` + `fetch` + `cancel` (see API docs — Advanced).
   */
  listDescriptor: (limit = 3) =>
    api.get<User[]>({
      url: "/users",
      params: { _limit: limit },
      requestOptions: usersListRequestOptions,
    }),

  getList: (limit = 3) => usersService.listDescriptor(limit).fetch(),
};
