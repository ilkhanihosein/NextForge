export { postsService } from "@/features/posts/api/posts.service";
export { getPosts, postsQueryOptions } from "@/features/posts/api/get-posts";
export { getPostById, postByIdQueryOptions } from "@/features/posts/api/get-post-by-id";
export { usePosts } from "@/features/posts/hooks/use-posts";
export { usePost } from "@/features/posts/hooks/use-post";
export { PostsList } from "@/features/posts/ui/posts-list";
export { PostCard } from "@/features/posts/ui/post-card";
export { PostDetail } from "@/features/posts/ui/post-detail";
export type { Post } from "@/features/posts/types/post.types";
