# Documentation index

Welcome. This folder is the **guided developer guide** for the boilerplate: how the app is structured, how data and auth move through it, and how to extend it safely.

**Brand new?** Read **[5-Minute Quick Start](#5-minute-quick-start)** first — orientation only, no deep dives. **Going deeper?** Use the [Developer learning path](#developer-learning-path) as a full course.

---

## 🚀 5-Minute Quick Start

*Orientation, not documentation. Read this once, then use the **Where to go next** table when you need detail.*

### 1. What this project is (very short)

This repo is a **Next.js (App Router) starter** with a **feature-based** layout: each product area lives under `src/features/<name>/`. It is meant for **real frontends** that call a JSON API and need to grow cleanly.

It already includes an **API layer** (Axios + helpers), **TanStack Query**, a **hybrid auth** setup (client tokens + cookies for the Edge), and **SSR route protection** via the proxy.

### 2. Mental model

#### Request flow (data)

When a screen loads or refetches data, think of a **straight line**:

```txt
UI  →  hooks  →  React Query  →  queryFn  →  http  →  Axios  →  your API
```

React Query holds cache and retries; **`http`** is the usual way **`queryFn`** talks to the backend.

#### Auth flow (session)

Login and logout go through one **coordination** path; the Edge gate uses **cookies**, not the browser token store:

```txt
UI  →  Auth Session Facade  →  tokenStore  +  cookies (kept in sync)
                                      ↓
                         SSR / navigation  →  middleware (reads cookies)
```

*You do not need the details yet — only that **data** and **auth** follow these two lines.*

### 3. Core building blocks

- **Features** — **Posts**, **Users**, and **Auth** are examples under `src/features/`. Same folder idea: `api/`, `hooks/`, `ui/`, `types/`.
- **API layer** — **`http.get` / `http.post`** by default; optional **`api.*`** “descriptors” when you outgrow the simple path.
- **React Query** — Shared **`queryOptions`** factories next to **`http`** calls (keys + `queryFn` in one place).
- **Auth** — **Session facade** for login/logout + cache; **tokens** for API calls; **cookies** so protected routes work on full page loads; **RBAC** helpers in the Auth feature.

### 4. How to add a new feature (minimal)

1. Add **`src/features/<thing>/types/`** — shapes your API returns.
2. Add **`src/features/<thing>/api/get-….ts`** — **`queryOptions`** + **`http`** in the **`queryFn`** (pass **`signal`**).
3. Add **`src/features/<thing>/hooks/use-….ts`** — thin **`useQuery`** / **`useMutation`** only.
4. Add **`src/features/<thing>/ui/`** + **`index.ts`** — UI uses hooks only; export what routes need.

Copy **Posts** or **Users** when in doubt.

### 5. Where to go next

| When you need… | Open |
| -------------- | ---- |
| Layers, proxy, full request lifecycle | [architecture.md](./architecture.md) |
| `http`, interceptors, errors, descriptors | [api-layer.md](./api-layer.md) |
| Tokens, cookies, facade, refresh, RBAC | [auth-system.md](./auth-system.md) |
| Rules, diagrams, pitfalls for features | [feature-blueprint.md](./feature-blueprint.md) |

---

## Developer learning path

Read (or skim) these **in this order**. Each step builds on the previous one.

| Step | Topic | Where to read | Why |
| ---- | ----- | ------------- | --- |
| **1** | **What this boilerplate is** | [project-context.md](./project-context.md) | Scope, stack, what is intentionally out of scope. |
| **2** | **How request flow works** (UI → Query → HTTP → API) | [architecture.md](./architecture.md) → *Request lifecycle* | End-to-end mental model for data. |
| **3** | **Feature modules** (Posts / Users / Auth) | [feature-blueprint.md](./feature-blueprint.md) | Folder contract: `api/` · `hooks/` · `ui/` · `types/`; Posts/Users as twins; Auth adds `session/`. |
| **4** | **Auth system** | [auth-system.md](./auth-system.md) | Tokens, cookies, facade, refresh, Edge proxy — read *If you are confused* first. |
| **5** | **Error handling model** | [api-error-handling.md](./api-error-handling.md) + [api-layer.md](./api-layer.md#error-normalization-response--thrown-errors) | Toasts vs silent retries, `ApiError` / `AuthError`, `meta`. |
| **6** | **How to add a new feature** | [getting-started.md](./getting-started.md#how-to-add-a-new-feature-step-by-step) | Step-by-step + copy-paste template. |
| **7** | **Deployment notes** | *Below* | Env on the host, build command, and official Next.js hosting docs. |

### Deployment notes (step 7)

- **Build:** `npm run build` then start with your platform’s Node adapter (e.g. `next start` or the host’s default).
- **Environment:** set the same **`NEXT_PUBLIC_*`** keys you use locally on the hosting dashboard; see [env-configuration.md](./env-configuration.md). Restart after changing env.
- **Auth / cookies:** production apps should use **HTTPS** so **Secure** cookies behave as intended (see [auth-system.md](./auth-system.md)).
- **Official reference:** [Next.js: Deploying](https://nextjs.org/docs/app/building-your-application/deploying) for Vercel, self-hosted Node, Docker, and static export tradeoffs.

---

## Core stack (bookmark these)

| Document | Role |
| -------- | ---- |
| [architecture.md](./architecture.md) | App layers, proxy, request lifecycle, **text diagram** of data + auth paths. |
| [api-layer.md](./api-layer.md) | `http`, `requestOptions`, interceptors, descriptors, error normalization. |
| [auth-system.md](./auth-system.md) | Session facade, `tokenStore` vs cookies, refresh, RBAC, **common issues**. |

Full catalog:

| Document                                                                     | Description                                                                                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [getting-started.md](./getting-started.md)                                   | **Onboarding:** run the app, env, **add a new feature** step-by-step, minimal template.                            |
| [feature-blueprint.md](./feature-blueprint.md)                               | **Canonical feature layout** (api / hooks / ui / types), rules, mental model diagram, pitfalls, FAQ.               |
| [project-context.md](./project-context.md)                                   | What this repo is (Next.js App Router stack) and what it deliberately does not include.                            |
| [architecture.md](./architecture.md)                                         | Layers: `app/`, `proxy`, `features/`, `lib/api`, providers, i18n, and how requests flow to the API.                |
| [auth-system.md](./auth-system.md)                                             | **Auth:** session facade, `tokenStore` vs cookies, refresh, `proxy`, RBAC, flows, mistakes.                       |
| [env-configuration.md](./env-configuration.md)                               | `NEXT_PUBLIC_*` variables, `.env.example`, and recommendations for a future Zod `env` module.                      |
| [internationalization.md](./internationalization.md)                         | Locale routing, dictionaries, RTL, and the Baloo Bhaijaan 2 font hook for `fa`.                                    |
| [api-layer.md](./api-layer.md)                                               | **Quick start** (`http` + React Query), core concepts, **advanced** descriptors / `RequestOptions` / interceptors. |
| [api-error-handling.md](./api-error-handling.md)                             | **At a glance** summary, then layers, silent retries, `meta`, antipatterns.                                        |
| [data-fetching-and-react-query.md](./data-fetching-and-react-query.md)       | Quick start, `QueryClient` defaults, global toasts, `queryOptions`, optional descriptor pattern.                   |
| [theming-and-design-tokens.md](./theming-and-design-tokens.md)               | CSS variables, `next-themes`, semantic success/error/info/warning tokens.                                          |
| [toast-system.md](./toast-system.md)                                         | Sonner + Framer Motion toasts, RTL/Farsi, `appToast` API.                                                          |
| [git-hooks-and-commit-conventions.md](./git-hooks-and-commit-conventions.md) | Husky, lint-staged, Commitlint, Commitizen (`cz-git`).                                                             |
| [troubleshooting.md](./troubleshooting.md)                                   | Turbopack lockfile warning, hooks, locale 404s, **auth / cookie sync** pitfalls.                                  |
