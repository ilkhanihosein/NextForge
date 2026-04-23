import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/http/api-client";

export type Post = {
  id: number;
  title: string;
  body: string;
};

const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>("/posts?_limit=3");
  return response.data;
};

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ["posts", "list"],
    queryFn: getPosts,
  });
};
