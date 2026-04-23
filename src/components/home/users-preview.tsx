"use client";

import { useUsersQuery } from "@/features/users";

export const UsersPreview = () => {
  const { data, isLoading, isError } = useUsersQuery(3);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading users...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Could not fetch users. Check `NEXT_PUBLIC_API_BASE_URL`.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {data?.map((user) => (
        <article
          key={user.id}
          className="rounded-xl border border-border/70 bg-panel px-3 py-2"
        >
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </article>
      ))}
    </div>
  );
};
