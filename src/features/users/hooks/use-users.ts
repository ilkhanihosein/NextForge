"use client";

import { useQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "@/features/users/api/get-users";

export function useUsers(limit = 10) {
  return useQuery(usersQueryOptions(limit));
}
