# Getting started

Use this page to **run the app in under a minute**, then **add your first feature in under two minutes** using the same pattern as **Posts** and **Users**.

---

## Run the app

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Set `NEXT_PUBLIC_API_BASE_URL` (defaults in `.env.example` usually point at JSONPlaceholder). Details: [env-configuration.md](./env-configuration.md).

3. **Dev server**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) — you are redirected to `/{defaultLocale}` (see `src/config/site.ts`).

---

## What to read next

| Goal                                                    | Document                                                               |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Canonical feature layout** (folders, rules, mistakes) | [feature-blueprint.md](./feature-blueprint.md)                         |
| **Layers** (app, proxy, `lib/api`, React Query)         | [architecture.md](./architecture.md)                                   |
| **`http` vs `api` descriptors**                         | [api-layer.md](./api-layer.md)                                         |
| **Queries, keys, toasts**                               | [data-fetching-and-react-query.md](./data-fetching-and-react-query.md) |

---

## How to add a new feature (step-by-step)

Follow **Posts** (`src/features/posts/`) or **Users** (`src/features/users/`) as living references. They are intentionally parallel.

### 1. Create the folder layout

```txt
src/features/<name>/
  api/
  hooks/
  ui/
  types/
  index.ts
```

### 2. Define the domain type

- Add `types/<name>.types.ts` (e.g. `comment.types.ts` with a `Comment` type).

### 3. Wire the API + React Query

- Add `src/lib/api/query-keys.ts` entries only if you need **prefix invalidation** aligned with `GET` paths (same pattern as `postsQueryPrefix` / `usersQueryPrefix`). Optional on day one; see [api-layer.md](./api-layer.md#query-key-prefixes-group-invalidation).
- In `api/get-<plural>.ts`: **`getX`**, **`xQueryOptions`** using **`queryOptions`** + **`http.get`** in `queryFn` (pass **`signal`** from `queryFn`).
- In `api/get-<name>-by-id.ts` (if you need detail): **`getXById`**, **`xByIdQueryOptions`** with a stable key such as `[...prefix, "detail", id]`.
- Optional: `*.service.ts` for **`requestOptions`** shared with public reads and an **advanced** `api.get` descriptor sample — same as `posts.service.ts` / `users.service.ts`.

### 4. Add hooks (thin only)

- `hooks/use-<plural>.ts` → `useQuery(xQueryOptions(...))`.
- `hooks/use-<name>.ts` → `useQuery({ ...xByIdQueryOptions(id), enabled: ... })` when `id` may be missing.

**Do not** put HTTP calls or `queryFn` bodies in hooks beyond delegating to shared `queryOptions`.

### 5. Build UI (hooks only)

- List: skeleton, error (+ refetch), empty, list.
- Cards / detail: consume **`useX`** hooks only — **no** `http` / `apiClient` in UI files.

### 6. Export from `index.ts`

Export types, query option factories (for prefetch), hooks, and UI pieces your routes need.

### 7. Mount in the App Router

- Add or import a **Client** subtree under `src/app/[locale]/...` where you call your components (or keep pages as RSC wrappers that render client children).

Done. For a **copy-paste skeleton**, use the template below.

---

## Minimal feature template (copy-paste)

Replace `comments` / `Comment` / `/comments` with your resource. Adjust keys if you add a prefix in `query-keys.ts`.

**`src/features/comments/types/comment.types.ts`**

```ts
export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};
```

**`src/features/comments/api/get-comments.ts`** (list; add `query-keys` import when you add a prefix)

```ts
import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";
import type { Comment } from "@/features/comments/types/comment.types";

export const getComments = (postId: number, signal?: AbortSignal) =>
  http.get<Comment[]>(`/posts/${postId}/comments`, { signal });

export const commentsQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ["comments", "list", postId] as const,
    queryFn: ({ signal }) => getComments(postId, signal),
  });
```

**`src/features/comments/hooks/use-comments.ts`**

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { commentsQueryOptions } from "@/features/comments/api/get-comments";

export function useComments(postId: number) {
  return useQuery(commentsQueryOptions(postId));
}
```

**`src/features/comments/ui/comments-list.tsx`** — pattern match **`PostsList`** / **`UsersList`**: `useComments` only, loading / error / empty / list.

**`src/features/comments/index.ts`** — re-export public API.

Then import `CommentsList` (or your equivalent) from `@/features/comments` in a page under `src/app/[locale]/`.

---

## Scripts reminder

`npm run lint`, `npm run typecheck`, `npm run build` — see root [README.md](../README.md#available-scripts).
