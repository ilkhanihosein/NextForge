# Data fetching and React Query

> **Start simple with `http.get`, scale to request descriptors (`api.*`) when your app grows.** Details: [api-layer.md](./api-layer.md).

**Onboarding:** [getting-started.md](./getting-started.md) · **Feature layout:** [feature-blueprint.md](./feature-blueprint.md)

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
- **`retry`:** Implemented as **`shouldRetry(failureCount, error)`** — returns **`false`** for **`isCancel`** (Axios cancellation), **`AuthError`**, and **`ApiError`** with **`status` in 400–499**; otherwise allows up to **two retries after the initial failure** (`failureCount < 2` → third attempt is the last). Mutations use the same predicate.
- **`retryDelay`:** Exponential backoff, cap 8s.
- **`refetchOnWindowFocus`:** `false` globally (override per query if needed).
- **`refetchOnReconnect`:** `true`.

**Interaction with the HTTP client:** Axios may already have retried once (refresh or network) before React Query sees an error. Global toasts fire only on **final** cache errors — see [api-error-handling.md](./api-error-handling.md#silent-retries-no-toast).

### Global error surfacing

- **`QueryCache.onError`** / **`MutationCache.onError`** → **`appToast.error`** only on **final** failure (after Axios + RQ retries). Silent paths: refresh queue, network retry — **[api-error-handling.md](./api-error-handling.md)**.
- **`AuthError`** is never globally toasted.
- **`meta`** (typed in **`src/lib/react-query/register.ts`**):

| Field | Effect |
| ----- | ------ |
| **`suppressErrorToast`** | When truthy, skips the global error toast for that query/mutation. |
| **`errorToastTitle`** | Overrides the default title (**“Request failed”** / **“Action failed”**). |

Toast **body** text: **`errorToastDescription`** in **`src/lib/react-query/error-toast-message.ts`** (prefers **`ApiError.message`**, else a short **`fieldErrors`** summary).

### Error types reaching React Query

Queries using **`http`** through **`apiClient`** reject with **`ApiError`** or **`AuthError`**, not raw **`AxiosError`**. Normalization happens in **`src/lib/api/client.ts`** + **`src/lib/api/errors.ts`** — diagram: [api-layer.md](./api-layer.md#error-normalization-response--thrown-errors).

---

## Advanced usage

**Skip this until you need it.**

### Request descriptors (`api` + `listDescriptor`)

Use **`api.get`** when **`{ fetch, cancel, queryKey }`** fits your flow better than **`http`** + a manual key. Example: **`postsService.listDescriptor`** in **`src/features/posts/api/posts.service.ts`**. When to choose **`http`** vs **`api`**: [api-layer.md](./api-layer.md#request-descriptors).

### Service layer

Keep **`queryFn`** thin. Prefer **`http.*`** by default; use **`descriptor.fetch()`** when you already built a descriptor.

---

## Related documents

| Topic           | Document                                         |
| --------------- | ------------------------------------------------ |
| HTTP client     | [api-layer.md](./api-layer.md)                   |
| Errors + toasts | [api-error-handling.md](./api-error-handling.md) |
| Auth + session  | [auth-system.md](./auth-system.md)               |
| Toasts          | [toast-system.md](./toast-system.md)             |
| Architecture    | [architecture.md](./architecture.md)             |

**Core stack:** [Documentation index](./README.md) · [Architecture](./architecture.md) · [API layer](./api-layer.md) · [Auth](./auth-system.md)
