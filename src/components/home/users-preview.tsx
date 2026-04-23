"use client";

import { UsersList } from "@/features/users";

/** Home column preview: compact list for the boilerplate sidebar. */
export const UsersPreview = () => {
  return <UsersList limit={3} />;
};
