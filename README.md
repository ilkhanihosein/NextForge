# Next.js Multilingual Starter

**Production-ready, adoptable starter** for real products: **Next.js 16**, **TypeScript**, **App Router**, **Tailwind CSS v4**, typed **i18n**, **TanStack Query** + **Axios**, and a **feature-first** layout that stays predictable as the app grows.

**Why this exists:** teams need a baseline that is not a toy demo — clear boundaries between **UI**, **data hooks**, **HTTP**, and **errors**, with two reference features (**Posts**, **Users**) you can copy instead of reverse-engineering the repo.

Keywords: **next.js starter**, **multilingual next.js**, **app router boilerplate**, **tailwind css template**, **dark mode next.js**, **react query axios setup**.

---

## What you get out of the box

| Area         | What’s included                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Routing**  | Locale-prefixed routes (`/en`, `/fa`), proxy redirect from `/`, RTL-ready layout                                                   |
| **Data**     | Typed `http` client, global React Query defaults, error → toast wiring, optional **descriptor** (`api`) pattern for advanced cases |
| **Features** | **Posts** + **Users** modules: `api/` · `hooks/` · `ui/` · `types/` · routes under `app/[locale]/`                                 |
| **UX**       | Theme (light / dark / system), toasts, route progress, accessible loading/error/empty patterns in reference UIs                    |
| **Quality**  | ESLint, Prettier, Husky, lint-staged, Commitlint, Commitizen                                                                       |

---

## When to use this starter

**Good fit:** multilingual or single-locale **dashboards**, **B2B SaaS** shells, **internal tools**, and products that will call a **REST/JSON API** from the browser with React Query.

**Not a goal of the template:** a full backend, database, or auth provider in-repo — you wire your API and tokens (hooks are ready for refresh patterns; see docs).

---

## Documentation (start here)

| Read first                                                     | Purpose                                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **[`docs/getting-started.md`](./docs/getting-started.md)**     | Install, env, dev server, **how to add a feature in ~2 minutes**, copy-paste template |
| **[`docs/feature-blueprint.md`](./docs/feature-blueprint.md)** | **Canonical** folder layout, layer rules, diagram, mistakes, FAQ                      |
| **[`docs/architecture.md`](./docs/architecture.md)**           | App Router layers, proxy, request lifecycle                                           |
| **[`docs/auth-system.md`](./docs/auth-system.md)**             | Hybrid auth, session facade, refresh, Edge gate, RBAC                                 |
| **[`docs/README.md`](./docs/README.md)**                       | Full index + **[Developer learning path](./docs/README.md#developer-learning-path)** (guided ~30 min)              |

**API mental model:** **`http.get` / `http.post`** = default simple path. **`api.*`** = optional request **descriptors** when you need `{ fetch, cancel, queryKey }` together — [`docs/api-layer.md`](./docs/api-layer.md).

**Data flow (browser):** **UI** → **hooks** (`useQuery` / `useMutation`) → **React Query** → **`queryFn`** (from shared **`queryOptions`**) → **`http`** (or advanced **`api`**) → **Axios** → your **API**.

---

## Consistent feature pattern

Every feature module in `src/features/*` follows the **same shape** (`api` / `hooks` / `ui` / `types`) so onboarding and code review stay cheap at scale. **Posts** and **Users** are intentional **twins** — learn one, you know the other. Details: [`docs/feature-blueprint.md`](./docs/feature-blueprint.md).

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` (see `.env.example`).

---

## Reference features (copy these)

| Module    | Path                  | Demonstrates                                                                  |
| --------- | --------------------- | ----------------------------------------------------------------------------- |
| **Posts** | `src/features/posts/` | List + detail, `postsQueryPrefix`, `queryOptions`, skeleton / error / empty   |
| **Users** | `src/features/users/` | Same architecture, different domain — proves the pattern is not post-specific |

Example routes: `/{locale}`, `/{locale}/users`, `/{locale}/users/[id]`, `/{locale}/posts/[id]`.

---

## Project structure (overview)

```txt
src/
  app/
    [locale]/                 # localized layout + pages
      page.tsx                # home (includes posts/users previews)
      users/                  # users index + dynamic detail
      posts/                  # post detail
    layout.tsx
    page.tsx                  # → default locale
  components/
    home/                     # page-level blocks wired into locale home
    providers/                # Query, theme, toast, app context
    ui/                       # shared controls (theme, language, progress)
  features/                   # ← feature modules (canonical pattern)
    posts/
      api/                    # get-posts, get-post-by-id, posts.service (optional descriptor)
      hooks/                  # usePosts, usePost
      ui/                     # PostsList, PostCard, PostDetail
      types/
      index.ts
    users/
      api/
      hooks/
      ui/
      types/
      index.ts
  config/                     # site, locales
  i18n/                       # dictionaries, getDictionary
  lib/
    api/                      # axios client, http, optional api descriptors, errors, query key prefixes
    react-query/              # QueryClient defaults, global error registration
    http/api-client.ts        # legacy re-export
  store/                      # example zustand
```

Deep dives: [`docs/architecture.md`](./docs/architecture.md), [`docs/feature-blueprint.md`](./docs/feature-blueprint.md).

---

## Core stack

- **Next.js 16**, **React 19**, **TypeScript**, **App Router**
- **Tailwind CSS v4** + CSS variable design tokens
- **next-themes**, **nprogress**, **zustand**
- **axios** + **@tanstack/react-query** (+ Devtools)
- **ESLint**, **Prettier**, **Husky**, **lint-staged**, **Commitlint**, **Commitizen**

---

## Available scripts

```bash
npm run dev          # start development server
npm run build        # production build
npm run start        # run built app
npm run lint         # lint codebase
npm run lint:fix     # fix lint issues
npm run typecheck    # run TypeScript checks
npm run format       # format all files
npm run format:check # verify formatting
npm run commit       # interactive conventional commit
```

---

## Environment variables

Use `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

More: [`docs/env-configuration.md`](./docs/env-configuration.md).

---

## Theming & i18n

- **Theme tokens:** `src/app/globals.css` (`--background`, `--primary`, `--brand`, …).
- **Locales:** `src/config/site.ts`; dictionaries under `src/i18n/dictionaries/`. See [`docs/internationalization.md`](./docs/internationalization.md).

---

## Git workflow

- **pre-commit:** `lint-staged`
- **commit-msg:** Commitlint (Conventional Commits)
- **`npm run commit`:** Commitizen

New repo: `git init` then `npm run prepare`.

Details: [`docs/git-hooks-and-commit-conventions.md`](./docs/git-hooks-and-commit-conventions.md).

---

## SEO notes

Structure supports semantic pages, locale-aware metadata, and SSG for locale roots. Next steps for production: `sitemap`, `robots`, Open Graph templates.
