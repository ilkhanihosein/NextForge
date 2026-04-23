"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/features/users/hooks/use-user";

type UserDetailProps = {
  userId: number;
};

export function UserDetail({ userId }: UserDetailProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const usersIndexHref = locale ? `/${locale}/users` : "/users";
  const homeHref = locale ? `/${locale}` : "/";

  const { data, isPending, isError, error, refetch } = useUser(userId);

  if (isPending) {
    return (
      <div className="rounded-2xl border border-border/70 bg-panel p-6" aria-busy="true">
        <div className="h-8 w-2/3 max-w-sm animate-pulse rounded bg-muted" />
        <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-muted/80" />
        <div className="mt-6 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
          <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
          <div className="h-3 w-[88%] animate-pulse rounded bg-muted/80" />
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
        <p className="font-medium text-destructive">Could not load this user</p>
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
            href={usersIndexHref}
            className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-brand underline-offset-4 hover:underline"
          >
            All users
          </Link>
          <Link
            href={homeHref}
            className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline"
          >
            Home
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
        User #{data.id}
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {data.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">@{data.username}</p>

      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Email
          </dt>
          <dd className="mt-0.5 text-foreground">{data.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Phone
          </dt>
          <dd className="mt-0.5 text-foreground">{data.phone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Website
          </dt>
          <dd className="mt-0.5">
            <a
              href={`https://${data.website.replace(/^https?:\/\//, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              {data.website}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
        <Link
          href={usersIndexHref}
          className="text-brand underline-offset-4 hover:underline"
        >
          ← All users
        </Link>
        <Link
          href={`${homeHref}#module-posts`}
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Posts module
        </Link>
      </div>
    </article>
  );
}
