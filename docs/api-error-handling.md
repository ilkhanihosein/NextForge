# API error handling: toasts, retries, and what to avoid

## At a glance

| What you need to know | Detail |
| --------------------- | ------ |
| **Who shows toasts?** | **`query-client.ts`** — **`QueryCache.onError`** / **`MutationCache.onError`** on **final** failure only (not per silent HTTP retry). |
| **Who stays silent?** | Axios **refresh + retry**, **queued** requests during refresh, **one network retry**, and React Query **`retry`** attempts — no toast until retries are exhausted. |
| **`AuthError`** | Never auto-toasted; handle redirect / session UI yourself. |
| **Opt out of global toast** | **`meta: { suppressErrorToast: true }`** (and optional **`errorToastTitle`**) on **`queryOptions`** / **`useMutation`**. |
| **What to avoid** | Toasts inside Axios interceptors; duplicate **`useQuery` `onError`** if you already use global cache toasts. |

The sections below spell out **layers**, **silent retries**, **`meta`**, and **antipatterns**.

---

## Layers (who does what)

| Layer | Responsibility |
| ----- | ---------------- |
| **Axios client** (`createApiClient`) | Silent **refresh + retry** on 401/403 (when configured), one **network** retry, normalize errors to `ApiError` / `AuthError`. **No toasts here.** |
| **React Query** (`retry`, cache callbacks) | Optional extra retries for **transient** failures; **global toast** on query/mutation errors that surface to the cache. |
| **UI** (`useQuery` / `useMutation` / forms) | Inline errors, field validation, redirects on auth, and **opt-out** from the global toast via `meta`. |

---

## Silent retries (no toast)

These paths are **intentionally silent** until they either succeed or fail for good:

1. **Access token refresh** — First 401/403 triggers `refreshTokens`, updates headers, and **retries the same request**. The user does not get a toast for “token refreshed”. If refresh fails, the thrown **`AuthError`** is final (see below).
2. **Queued requests** — While refresh runs, other failed requests wait on the queue and retry with the new token; again **no per-attempt toast**.
3. **Network / timeout** — The client waits ~1s and **retries once** (`_networkRetried`). No toast for that retry attempt.
4. **React Query `retry`** — Failed `queryFn` / `mutationFn` may run again (exponential backoff) **without** firing `QueryCache.onError` until retries are exhausted. Toasts only run when the failure is **final** for that observer cycle.

So: **toast = final failure** at the React Query cache boundary (after client + RQ retries), not “every HTTP attempt”.

---

## Global toasts (`query-client.ts`)

- **`QueryCache.onError`** — Shows **`appToast.error`** with title **“Request failed”** (or `meta.errorToastTitle`).
- **`MutationCache.onError`** — Same pattern with title **“Action failed”** (or `meta.errorToastTitle`).
- **`AuthError` is never toasted globally** — You should redirect to login, clear UI, or show a **dedicated** screen; avoid duplicate noisy toasts alongside `onAuthFailure`.
- **Descriptions** use `errorToastDescription()` — prefers `ApiError` message, else first **field** error from `fieldErrors` (good for 422-style payloads).

### Per-query / per-mutation: skip or customize the global toast

Typed **`meta`** (see `src/lib/react-query/register.ts`):

```ts
import { queryOptions } from "@tanstack/react-query";

queryOptions({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  meta: { suppressErrorToast: true }, // handle error in component / error boundary
});

useMutation({
  mutationFn: saveProfile,
  meta: {
    suppressErrorToast: true,
    errorToastTitle: "Profile not saved",
  },
});
```

Use **`suppressErrorToast: true`** when:

- You show **inline** / **form field** errors instead.
- The query is **non-critical** (background prefetch) and silence is OK.
- You will handle **`AuthError`** in one place (global toast is already skipped for `AuthError`, but you might still use this for other cases).

---

## `AuthError` and session end

| Situation | Typical UX |
| --------- | ------------ |
| Refresh fails, 401/403 without refresh, **412** | `clearTokens` + `onAuthFailure` — **redirect** or modal; **do not** rely on a generic error toast as the only signal. |
| `skipAuthRefresh: true` | No refresh attempt; user may need a login flow for that call. |

Global handlers **skip toasts for `AuthError`** on both queries and mutations so you can centralize auth UX.

---

## What to avoid

1. **Toasts inside Axios interceptors** — Duplicates React Query + obscures “final vs retry” semantics.
2. **Toasting on every `onError` of `useQuery`** when you already use **global** cache toasts — double messages unless you suppressed the global one with `meta`.
3. **Generic “Error” copy for validation** — Prefer `fieldErrors` in the **form**; use toast for a **single** summary or `errorToastDescription` already picks a short field message when present.
4. **Retrying 4xx** — `shouldRetry` in `query-client.ts` already avoids retrying client errors (`ApiError` 4–5xx band 400–499) and `AuthError`. Do not widen retries for obvious user mistakes (duplicate email, etc.).
5. **Relying only on toast for critical flows** — Bank-style actions still need inline state (“payment failed”) and recovery actions.

---

## Related files

| File | Role |
| ---- | ---- |
| `src/lib/api/client.ts` | Refresh queue, network retry, throws `ApiError` / `AuthError`. |
| `src/lib/api/errors.ts` | `ApiError`, `AuthError`, payload normalization. |
| `src/lib/react-query/query-client.ts` | Global toasts, RQ `retry`, `AuthError` / `meta` guards. |
| `src/lib/react-query/error-toast-message.ts` | `errorToastDescription` for toast body text. |
| `src/lib/react-query/register.ts` | TanStack `Register` typing for `meta`. |
| [toast-system.md](./toast-system.md) | `appToast` API and styling. |
