"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { User } from "@/features/users/types/user.types";

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const href = locale ? `/${locale}/users/${user.id}` : `/users/${user.id}`;

  return (
    <article className="rounded-xl border border-border/70 bg-panel p-4 transition hover:border-brand/40">
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
      >
        <p className="text-sm font-semibold text-foreground">{user.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">@{user.username}</p>
        <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{user.email}</p>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          User #{user.id}
        </p>
      </Link>
    </article>
  );
}
