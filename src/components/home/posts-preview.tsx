"use client";

import { usePostsQuery } from "@/features/posts/api/get-posts";

export const PostsPreview = () => {
  const { data, isLoading, isError } = usePostsQuery();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading posts...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Could not fetch posts. Check `NEXT_PUBLIC_API_BASE_URL`.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data?.map((post) => (
        <article
          key={post.id}
          className="rounded-xl border border-border/70 bg-panel p-3"
        >
          <h3 className="line-clamp-1 text-sm font-semibold">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.body}</p>
        </article>
      ))}
    </div>
  );
};
