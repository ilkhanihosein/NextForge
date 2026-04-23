# Data fetching and React Query

> **Start simple with `http.get`, scale to request descriptors (`api.*`) when your app grows.** Details: [api-layer.md](./api-layer.md).

---

## Quick start

```tsx
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api/http";

useQuery({
  queryKey: ["posts"],
  queryFn: () => http.get("/posts"),
});
```

Add **`signal`** when you want cancellation tied to the query lifecycle:

```tsx
queryFn: ({ signal }) => http.get("/posts", { signal }),
```

**`requestOptions`**, **`api`**, and **`coreHttp`** are optional — [api-layer.md](./api-layer.md#advanced-usage).

---

## Common usage

### `queryOptions` (recommended in features)

Export factories so keys and **`queryFn`** stay in sync across **`useQuery`**, **`prefetchQuery`**, and loaders:

```ts
import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/api/http";

export const postsQueryOptions = (limit: number) =>
  queryOptions({
    queryKey: ["posts", "list", limit] as const,
    queryFn: ({ signal }) => http.get("/posts", { signal, params: { _limit: limit } }),
  });
```

**This template’s** post and user modules also use **`postsQueryPrefix` / `usersQueryPrefix`** so **`invalidateQueries`** matches descriptor-style keys if you add them later — see **`src/features/posts/api/get-posts.ts`** and [api-layer.md](./api-layer.md#query-key-prefixes-group-invalidation).

---

## Core concepts

### Provider

- **`src/components/providers/query-provider.tsx`** — `QueryClientProvider` + React Query Devtools (client-only).

### Query client defaults

**File:** `src/lib/react-query/query-client.ts`

- **`staleTime`:** 2 minutes.
- **`gcTime`:** 10 minutes.
- **`retry`:** Skips **`AuthError`** and typical **4xx** **`ApiError`**; retries transient/server issues (up to 2 attempts).
- **`retryDelay`:** Exponential, cap 8s.
- **`refetchOnWindowFocus`:** `false` globally (override per query if needed).
- **`refetchOnReconnect`:** `true`.

### Global error surfacing

- **`QueryCache.onError`** / **`MutationCache.onError`** → **`appToast.error`** only on **final** failure (after Axios + RQ retries). Silent paths: refresh queue, network retry — **[api-error-handling.md](./api-error-handling.md)**.
- **`AuthError`** is never globally toasted.
- **`meta.suppressErrorToast`** / **`meta.errorToastTitle`** — **`src/lib/react-query/register.ts`**; **`errorToastDescription`** — **`src/lib/react-query/error-toast-message.ts`**.

---

## Advanced usage

**Skip this until you need it.**

### Request descriptors (`api` + `listDescriptor`)

Use **`api.get`** when **`{ fetch, cancel, queryKey }`** fits your flow better than **`http`** + a manual key. Example: **`postsService.listDescriptor`** in **`src/features/posts/api/posts.service.ts`**. When to choose **`http`** vs **`api`**: [api-layer.md](./api-layer.md#request-descriptors).

### Service layer

Keep **`queryFn`** thin. Prefer **`http.*`** by default; use **`descriptor.fetch()`** when you already built a descriptor.

---

## Related documents

| Topic | Document |
| ----- | -------- |
| HTTP client | [api-layer.md](./api-layer.md) |
| Errors + toasts | [api-error-handling.md](./api-error-handling.md) |
| Toasts | [toast-system.md](./toast-system.md) |
| Architecture | [architecture.md](./architecture.md) |
