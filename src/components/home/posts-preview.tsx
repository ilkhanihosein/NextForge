"use client";

import { PostsList } from "@/features/posts";

/** Home column preview: same module the docs reference, with a small limit. */
export const PostsPreview = () => {
  return <PostsList limit={3} />;
};
