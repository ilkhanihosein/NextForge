"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Post } from "@/features/posts/types/post.types";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const href = locale ? `/${locale}/posts/${post.id}` : `/posts/${post.id}`;

  return (
    <article className="rounded-xl border border-border/70 bg-panel p-4 transition hover:border-brand/40">
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
      >
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {post.body}
        </p>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Post #{post.id}
        </p>
      </Link>
    </article>
  );
}
