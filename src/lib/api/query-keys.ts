/**
 * Leading segments for post list queries — use with `invalidateQueries({ queryKey: [...postsQueryPrefix] })`.
 * Matches both simple `queryKey: [...postsQueryPrefix, params]` hooks and descriptor-backed keys that start with method + path.
 */
export const postsQueryPrefix = ["GET", "/posts"] as const;
export const usersQueryPrefix = ["GET", "/users"] as const;
