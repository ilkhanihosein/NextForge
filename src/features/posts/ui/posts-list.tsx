"use client";

import { usePosts } from "@/features/posts/hooks/use-posts";
import { PostCard } from "@/features/posts/ui/post-card";

type PostsListProps = {
  /** Passed through to the list request (`_limit` on `/posts`). */
  limit?: number;
  className?: string;
};

function PostsListSkeleton() {
  return (
    <ul className="space-y-3" aria-busy="true" aria-label="Loading posts">
      {[0, 1, 2].map((key) => (
        <li key={key} className="rounded-xl border border-border/60 bg-panel/50 p-4">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted/80" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-muted/80" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PostsList({ limit = 10, className }: PostsListProps) {
  const { data, isPending, isError, error, refetch, isFetching } = usePosts(limit);

  if (isPending) {
    return <PostsListSkeleton />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
      >
        <p className="font-medium text-destructive">Something went wrong</p>
        <p className="mt-1 text-muted-foreground">
          {error instanceof Error ? error.message : "Could not load posts."}
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
        <p className="text-sm font-medium text-foreground">No posts</p>
        <p className="mt-1 text-xs text-muted-foreground">
          There is nothing to show for this feed yet.
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
        {data.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
