"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePost } from "@/features/posts/hooks/use-post";

type PostDetailProps = {
  postId: number;
};

export function PostDetail({ postId }: PostDetailProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const listHref = locale ? `/${locale}` : "/";

  const { data, isPending, isError, error, refetch } = usePost(postId);

  if (isPending) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-6" aria-busy="true">
        <div className="h-8 w-3/4 max-w-md animate-pulse rounded bg-muted" />
        <div className="mt-6 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
          <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
          <div className="h-3 w-[92%] animate-pulse rounded bg-muted/80" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm"
      >
        <p className="font-medium text-destructive">Could not load this post</p>
        <p className="mt-1 text-muted-foreground">
          {error instanceof Error ? error.message : "Request failed."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
          >
            Try again
          </button>
          <Link
            href={listHref}
            className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-brand underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-border/70 bg-panel p-6 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Post #{data.id} · User {data.userId}
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {data.title}
      </h1>
      <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {data.body}
      </p>
      <Link
        href={listHref}
        className="mt-8 inline-flex text-sm font-semibold text-brand underline-offset-4 hover:underline"
      >
        ← Back
      </Link>
    </article>
  );
}
