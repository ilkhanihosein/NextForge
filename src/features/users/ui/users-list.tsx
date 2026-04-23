"use client";

import { useUsers } from "@/features/users/hooks/use-users";
import { UserCard } from "@/features/users/ui/user-card";

type UsersListProps = {
  /** Passed through to the list request (`_limit` on `/users`). */
  limit?: number;
  className?: string;
};

function UsersListSkeleton() {
  return (
    <ul className="space-y-3" aria-busy="true" aria-label="Loading users">
      {[0, 1, 2].map((key) => (
        <li key={key} className="rounded-xl border border-border/60 bg-panel/50 p-4">
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted/80" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/80" />
        </li>
      ))}
    </ul>
  );
}

export function UsersList({ limit = 10, className }: UsersListProps) {
  const { data, isPending, isError, error, refetch, isFetching } = useUsers(limit);

  if (isPending) {
    return <UsersListSkeleton />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
      >
        <p className="font-medium text-destructive">Something went wrong</p>
        <p className="mt-1 text-muted-foreground">
          {error instanceof Error ? error.message : "Could not load users."}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Confirm{" "}
          <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_API_BASE_URL</code>{" "}
          points at your API.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
        <p className="text-sm font-medium text-foreground">No users</p>
        <p className="mt-1 text-xs text-muted-foreground">
          There is nothing to show for this directory yet.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {isFetching && !isPending ? (
        <p className="mb-2 text-xs text-muted-foreground">Updating…</p>
      ) : null}
      <ul className="space-y-3">
        {data.map((user) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
}
