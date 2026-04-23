# Authentication and session

This document explains **how auth is wired in this boilerplate** end to end: hybrid storage (client tokens + HttpOnly cookies), the **Auth Session Facade**, refresh, Edge protection, and RBAC. It matches the current implementation in `src/features/auth/`, `src/lib/api/`, `src/lib/auth/`, and `src/proxy.ts`.

**Related:** [architecture.md](./architecture.md) (layers, request lifecycle) · [api-layer.md](./api-layer.md) (interceptors, `requestOptions`) · [api-error-handling.md](./api-error-handling.md) (`AuthError`, toasts)

---

### If you are confused, read this first

- **Browser (client):** React runs here. **`tokenStore`** holds tokens in **`localStorage`** so Axios can send **`Authorization`**. Login/logout in feature code should use the **Auth Session Facade** (`setSession` / `clearSession`).
- **SSR / first navigation:** The **Edge proxy** (`src/proxy.ts`) runs **before** your client bundle. It only sees **HTTP cookies**, not `localStorage`.
- **Cookies (`auth_at`, `auth_rt`):** **HttpOnly** session cookies set by **`/api/auth/session`**. They tell the **proxy** “this browser is allowed to hit protected routes” on full page loads.
- **`tokenStore`:** Same tokens as the API uses for **Bearer** headers and for **refresh** inside the Axios interceptor. Not visible to the Edge proxy.
- **Auth Session Facade:** One place in **feature** code to **write both** `tokenStore` and cookies together (plus optional **`me`** cache). It does **not** replace the interceptor refresh — that stays in **`src/lib/api/`**.
- **Refresh:** On **401** or **403**, Axios may call **`/api/auth/refresh`** once per failed request (with a queue so concurrent calls do not stampede). That path updates **`tokenStore`** and cookies **without** going through the facade.

---

## Mental model (one paragraph)

The browser keeps **access and refresh tokens** in **`tokenStore`** (memory + `localStorage`) so **Axios** can attach `Authorization` on API calls. **Separately**, the same tokens are **mirrored into HttpOnly cookies** via **`POST /api/auth/session`** so **`src/proxy.ts`** (Edge) can gate **SSR navigations** to protected routes **without** reading `localStorage`. **Login / logout / bootstrap** in feature code should go through the **Auth Session Facade** so token store and cookie sync stay aligned. **Token refresh** runs inside the **Axios response interceptor** using **`performTokenRefresh`** (`fetch` to **`/api/auth/refresh`**, not `http`) to avoid recursion; it updates **`tokenStore`** and already calls **`syncSessionCookiesFromTokens`** — that path does **not** go through the facade, by design.

---

## `tokenStore` vs cookies

| Concern | **`tokenStore`** (`src/lib/api/token-store.ts`) | **HttpOnly cookies** (`src/lib/auth/session-cookies.ts` + Route Handlers) |
| ------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| **Who reads** | Axios request interceptor, `getSession()` facade, refresh helper | **`src/proxy.ts`** (Edge), server Route Handlers |
| **Storage** | In browser: `localStorage` keys; SSR: in-memory only for the request | `auth_at`, `auth_rt` cookies set/cleared by **`/api/auth/session`** |
| **Purpose** | Attach **Bearer** token to API calls; enable client-only refresh | **Navigation gates** before React hydrates |
| **Cleared on logout** | Yes (`clearSession` → `tokenStore.clearTokens`) | Yes (`clearSession` → `DELETE /api/auth/session`) |

**Rule of thumb:** anything that calls your **JSON API** from the client should rely on **`tokenStore`** (via interceptors). Anything that must run on the **Edge** for **full page loads** must rely on **cookies**.

---

## Auth Session Facade

**Location:** `src/features/auth/session/` (exported from `@/features/auth`).

The facade is **not** a second auth system. It is the **only supported place in feature code** to coordinate:

- writing / clearing **`tokenStore`**
- triggering **cookie sync** via existing helpers in `src/lib/api/refresh-session.ts`
- optionally seeding or clearing the **`auth/me`** React Query cache

### Public API

| Function | Role |
| -------- | ---- |
| **`getSession()`** | Snapshot of tokens from `tokenStore` (browser only; SSR returns empty snapshot). |
| **`isAuthenticated()`** | `true` when an **access token** exists in `tokenStore` (same signal used to **enable** the `auth/me` query). |
| **`setSession(tokens, user?, queryClient?)`** | Sets tokens, mirrors cookies, optionally **`setQueryData`** for `me`. |
| **`clearSession(queryClient?)`** | Clears cookies, clears tokens, optionally **`removeQueries`** for `me`. |
| **`ensureSessionCookiesFromStore()`** | If an access token exists locally but cookies might be stale (e.g. after upgrade), **re-sync** cookies once. Used by **`AuthSessionBootstrap`**. |

### What the facade deliberately does **not** do

- **No** new storage mechanisms.
- **No** duplicate refresh implementation — refresh stays in **`createApiClient`** + **`performTokenRefresh`**.
- **No** changes to **`src/proxy.ts`** or interceptors.

### Naming: facade vs `useAuth()`

- **`isAuthenticated()`** (facade) = **“I have an access token”** (session can be established).
- **`useAuth().isAuthenticated`** = **“The `auth/me` query has returned a user object”** (identity loaded). Until `me` resolves, you can have a token but not yet `user`.

When in doubt, read the hook as **“has user from API”** and the facade as **“has token”**.

---

## Flows

### Login

1. UI submits credentials; Route Handler or client hits login API and receives **tokens** (+ optional user).
2. **`setSession(tokens, user?, queryClient?)`** updates **`tokenStore`**, **`POST /api/auth/session`** sets cookies, optionally caches **`me`**.
3. Subsequent **`http`** calls send **Bearer** from `tokenStore`; full page navigations to protected routes see **cookies** in **`proxy`**.

### Logout

1. **`clearSession(queryClient?)`** clears cookies (**`DELETE /api/auth/session`**), clears **`tokenStore`**, removes **`me`** from cache.
2. UI redirects or shows logged-out state as today.

### Session bootstrap (`AuthSessionBootstrap`)

Mounted once in the client tree. If tokens exist in **`tokenStore`** but the user opened a tab without cookies (or after deploy), **`ensureSessionCookiesFromStore()`** mirrors tokens to cookies so **middleware** and SSR stay consistent.

### `auth/me` and `useAuth`

- **`authMeQueryOptions`** runs **`http.get`** to your **`/me`** (or template equivalent).
- **`useAuth`** enables that query **only when `isAuthenticated()`** (facade) is true.
- On **`401` / `AuthError`** from **`me`**, **`clearSession`** runs so stale tokens do not loop forever.

---

## Refresh token lifecycle

1. A secured **`http`** request returns **401** or **403**.
2. Interceptor checks **`skipAuthRefresh`**, **`_refreshAttempted`**, and presence of **`refreshTokens`** + **`getRefreshToken`**.
3. **Single-flight:** concurrent failures queue until one refresh finishes.
4. **`performTokenRefresh(refreshToken)`** runs **`fetch`** to **`/api/auth/refresh`** (bypasses Axios), then **`syncSessionCookiesFromTokens`** and returns new **`ApiTokens`**.
5. Interceptor calls **`tokenStore.setTokens`** (via client config **`setTokens`**) and **retries the original request** once.
6. If refresh throws: **`clearTokens`**, **`onAuthFailure`** (clears **session cookies** client-side in `http.ts`), queue flushed with **`AuthError`**.

**Important:** this path updates **`tokenStore`** and cookies **inside `lib`**. Feature code should not re-implement refresh; extend **`performTokenRefresh`** / Route Handlers if the backend contract changes.

---

## Axios `onAuthFailure` vs `clearSession`

After failed refresh (or similar), the client calls **`onAuthFailure`**. In **`http.ts`** this runs **`clearSessionCookiesClient()`** only — **not** the full facade — so **`lib/api` does not import `features`**. **`tokenStore`** is still cleared in the same interceptor branch via **`clearTokens`**. Feature-level logout and **`clearSession`** remain the single **user-initiated** way to wipe **both** in one call.

---

## Edge proxy and protected routes

**Implementation:** `src/proxy.ts` (Next **Proxy** / edge matcher).

- **Locale:** paths without a leading locale segment redirect to **`/${defaultLocale}...`**.
- **Protected segments:** under each locale, **`/profile`** and **`/dashboard`** (and subpaths) require a **valid access cookie** unless the path is **`/login`**.
- **Demo template:** **`isDemoAccessToken`** treats values starting with **`demo.`** as allowed so the shipped UI can illustrate protected pages without a real IdP.

**Cookies are the only signal here** — the Edge runtime does not read `localStorage`. That is why cookie sync after login and **`AuthSessionBootstrap`** matter.

---

## RBAC

- **`AuthUser`** includes **`role`** (`src/features/auth/types/auth.types.ts`).
- **`RequireRole`** (`src/features/auth/ui/require-role.tsx`) waits until **`useAuth().isAuthenticated`** is true (i.e. **`me`** returned), then compares **`user.role`** to the required role. Wrong role → forbidden UI (dictionary string), not a redirect by default.

Client RBAC is **additive** to server checks; never rely on UI alone for authorization.

---

## Key files

| File | Role |
| ---- | ---- |
| `src/features/auth/session/auth-session.ts` | Facade implementation |
| `src/features/auth/hooks/use-login.ts` / `use-logout.ts` / `use-auth.ts` | Feature hooks using facade + `me` query |
| `src/features/auth/ui/auth-session-bootstrap.tsx` | Cookie repair on load |
| `src/lib/api/token-store.ts` | Token persistence (browser `localStorage`) |
| `src/lib/api/refresh-session.ts` | Refresh **`fetch`**, cookie sync/clear helpers |
| `src/lib/api/http.ts` | Wires **`performTokenRefresh`**, **`tokenStore`**, **`onAuthFailure`** |
| `src/lib/api/client.ts` | Interceptors (refresh queue, retry, errors) |
| `src/lib/auth/session-cookies.ts` | Cookie names + helpers for Route Handlers |
| `src/proxy.ts` | Edge auth gate for protected routes |
| `src/app/api/auth/*` | Session + refresh + login handlers (template) |

---

## Common issues (debugging)

**Login works but SSR / full page load still redirects to login**  
API calls succeed because **`tokenStore`** has a token, but **`proxy`** only checks **cookies**. Fix: use **`setSession`** after login (or **`AuthSessionBootstrap`**) so cookies are mirrored — see [troubleshooting.md](./troubleshooting.md).

**A token exists in `localStorage` but the UI shows logged out**  
The **`auth/me`** query may have failed with **401** (then **`clearSession`** runs), or you only have a token and **`useAuth().isAuthenticated`** (user object) is still false until **`me`** succeeds. Compare facade **`isAuthenticated()`** (token) vs hook **`isAuthenticated`** (user loaded).

**“Refresh loop” confusion**  
The client uses **one refresh attempt per original request** (`_refreshAttempted`) and a **single-flight queue** so parallel 401s share one refresh. It is not an infinite loop; if you see repeated failures, the refresh endpoint or **`performTokenRefresh`** contract is likely wrong.

**401 vs 403**  
For **secured** calls, **both** statuses can trigger the **same** refresh-and-retry path when **`skipAuthRefresh`** is not set. If refresh is skipped or fails, both surface as **`AuthError`** to callers — the stack does not branch different user-facing messages for 401 vs 403 in the interceptor itself.

---

## Common mistakes

| Mistake | Why it hurts | Instead |
| ------- | ------------ | ------- |
| Calling **`tokenStore`** or **`syncSessionCookiesFromTokens`** from new feature UI/hooks | Bypasses one place for session rules; easy to desync cookies and store | **`setSession` / `clearSession`** from `@/features/auth/session` |
| Expecting **`proxy`** to see a login that only updated **`tokenStore`** | Edge never reads `localStorage` | Always run cookie sync after login (**`setSession`** handles it) |
| Conflating **`isAuthenticated()`** with **`useAuth().isAuthenticated`** | Wrong loading gates or redirects | Use facade for **token**; hook field for **loaded user** |
| Toasting **`AuthError`** globally for auth flows | Global Query cache already **skips** `AuthError` toasts | Redirect or inline session UI ([api-error-handling.md](./api-error-handling.md)) |

---

## See also

- [README.md](./README.md) — **Developer learning path** and full doc index
- [architecture.md](./architecture.md) — global layers and **text diagram** (data path + auth path)
- [api-layer.md](./api-layer.md) — interceptors, refresh, error normalization
- [getting-started.md](./getting-started.md) — add a feature; auth is orthogonal but often touches `http` + Query
- [api-error-handling.md](./api-error-handling.md) — `AuthError`, retries, `meta.suppressErrorToast`
- [troubleshooting.md](./troubleshooting.md) — auth / session subsection

**Core stack:** [Documentation index](./README.md) · [Architecture](./architecture.md) · [API layer](./api-layer.md)
