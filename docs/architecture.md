# Architecture overview

High-level layout for this boilerplate: how the **App Router**, **locale routing**, **feature modules**, **shared HTTP/React Query infrastructure**, and **UI shell** fit together. **Path names** below match the repo as shipped; rename or split folders as your product grows.

**Product scope:** see [project-context.md](./project-context.md).

---

## Adapting the boilerplate

Typical first steps when starting a **new** product from this repo:

1. **Identity:** update `name`, `description`, and `version` in `package.json`; point `git remote` at your repository.
2. **Environment:** copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` (and any future secrets). Consider adding a Zod-validated `src/config/env.ts` so `process.env` is not scattered.
3. **Locales:** edit `src/config/site.ts` (`locales`, `defaultLocale`, `rtlLocales`) and add dictionary files under `src/i18n/dictionaries/`.
4. **Features:** add `src/features/<your-feature>/` using the same **`api/` · `hooks/` · `ui/` · `types/`** layout as **`posts`** and **`users`** (see [feature-blueprint.md](./feature-blueprint.md)). Remove or replace the sample modules when unused.
5. **API layer:** extend `src/lib/api/` (token refresh implementation, extra clients, headers). Wire real auth in `src/lib/api/http.ts`.
6. **Theming:** adjust semantic tokens and surfaces in `src/app/globals.css`; keep Tailwind `@theme inline` in sync if you add new `--color-*` mappings.
7. **Routing:** keep `src/proxy.ts` aligned with `siteConfig.locales` if you add locales (Next 16 uses the `proxy` convention for edge redirects).

Nothing under `src/features/` is required for the **framework** of layouts, i18n, or providers—only what you import into routes matters.

---

## Layers

### App Router and entry (`src/app/`)

- **`layout.tsx` (root):** HTML shell, global fonts (Geist + optional Baloo Bhaijaan 2 variable), `globals.css`, `suppressHydrationWarning` on `<html>` for theme.
- **`page.tsx` (root):** Redirects `/` to `/${defaultLocale}` from `src/config/site.ts`.
- **`[locale]/layout.tsx`:** Per-locale providers, `dir` for RTL, optional `locale-fa` font class on `<main>`, metadata from dictionaries.
- **`[locale]/page.tsx`:** Example marketing/home UI (language switcher, theme toggle, **posts** + **users** API demos, toast demo).
- **`not-found.tsx`:** Global 404 UI themed with design tokens.

**Rule:** Route files stay thin; heavy UI lives under `src/components/` or `src/features/*/components/`.

### Proxy / edge routing (`src/proxy.ts`)

- **Role:** Prefix all non-static paths with a default locale when the first segment is not a known locale.
- **Pattern:** Same responsibility as legacy `middleware`; Next 16 surfaces it as **Proxy** in build output.

### Feature modules (`src/features/<feature>/`)

- **Role:** Bounded context for a product area (e.g. **posts**, **users**): HTTP + cache keys + hooks + UI for that domain only.
- **Pattern:** `types/` for domain types; `api/get-*.ts` for **`http`** + **`queryOptions`**; optional `*.service.ts` for shared **`requestOptions`** and an **advanced** `api.get` descriptor; `hooks/` for thin **`useQuery`** / **`useMutation`** wrappers; `ui/` for components that consume hooks only; **`index.ts`** barrel. **Canonical spec:** [feature-blueprint.md](./feature-blueprint.md).

**Consistency:** all shipped features use the **same folder contract** so the repo scales like a small **framework** — predictable reviews, copy-paste growth, aligned invalidation. **Posts** and **Users** are twin references; diverge only when you have a documented reason.

### Shared infrastructure

| Area                        | Location                       | Responsibility                                                                                                                                                                            |
| --------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP client, errors, tokens | `src/lib/api/`                 | Axios instance, interceptors, typed helpers, query key factories                                                                                                                          |
| Legacy re-export            | `src/lib/http/api-client.ts`   | Re-exports `apiClient` from `@/lib/api/http` for older imports                                                                                                                            |
| React Query                 | `src/lib/react-query/`         | `QueryClient` defaults, global error → toast, typed `meta` (see [data-fetching-and-react-query.md](./data-fetching-and-react-query.md), [api-error-handling.md](./api-error-handling.md)) |
| Utilities                   | `src/lib/utils.ts`             | `cn()` for class merging                                                                                                                                                                  |
| Toasts                      | `src/lib/toast.tsx`, providers | App-level notifications (see [toast-system.md](./toast-system.md))                                                                                                                        |

### Presentation (`src/components/`)

- **`providers/`:** `ThemeProvider`, `QueryProvider`, `AppProviders`, `ToastProvider`—compose client-side context.
- **`ui/`:** Reusable controls (language switcher, theme toggle, navigation progress).
- **`home/`:** Page-specific blocks wired into `[locale]/page.tsx`.

### Configuration (`src/config/`)

- **`site.ts`:** App name copy, `locales`, `defaultLocale`, `rtlLocales`, exported `Locale` type.

### Internationalization (`src/i18n/`)

- Typed dictionaries per locale, `getDictionary`, `getDirection`. Details: [internationalization.md](./internationalization.md).

### Context and client state

- **`src/context/app-context.tsx`:** `locale` + `dictionary` for client components.
- **`src/store/ui-store.ts`:** Example Zustand store (sidebar flag)—replace or extend per feature.

---

## Request lifecycle (browser → API)

**Mental model:** **UI (components)** → **hooks** (`useQuery` / `useMutation` from feature `hooks/`) → **React Query** (cache, dedupe, retries) → **`queryFn`** inside shared **`queryOptions`** (`api/`) → **`http`** (default) **or** **`api`** (advanced descriptors) → **Axios** (`apiClient`, interceptors) → your **API**.

- **`http`** — default: call **`http.get` / `http.post`** (etc.) from `queryFn`; pass **`signal`** for cancellation.
- **`api`** — optional descriptors when **`{ fetch, cancel, queryKey }`** in one object is worth the indirection ([api-layer.md](./api-layer.md)).

1. User action or mount triggers a **feature hook**, which calls **`useQuery`** / **`useMutation`** with options from **`api/`** (typically **`queryOptions({ queryKey, queryFn })`**).
2. **`queryFn`** calls **`http.get` / `http.post`** (etc.) from `@/lib/api`, passing **`signal`** when you want cancellation tied to the query lifecycle.
3. **Axios** `apiClient` applies request interceptors (e.g. `Authorization`, `x-request-id`).
4. On **401**, optional refresh queue runs (placeholder in `http.ts` until you implement real refresh).
5. Errors normalize to **`ApiError`** / **`AuthError`**; Query/Mutation caches can surface **final** toasts (not per silent retry — see [api-error-handling.md](./api-error-handling.md)).

Diagram (including optional **`api`** branch): [api-layer.md](./api-layer.md#request-flow).

See [api-layer.md](./api-layer.md), [data-fetching-and-react-query.md](./data-fetching-and-react-query.md), and [api-error-handling.md](./api-error-handling.md).

---

## Static assets

- **`public/`:** Favicon and static images referenced by Next/Image or `<img>` as needed.

---

## Testing and CI (current state)

Local scripts: `lint`, `typecheck`, `build`, `format`, `format:check`. There is **no** bundled GitHub Actions workflow; add `.github/workflows/ci.yml` if you want remote CI. Hooks: [git-hooks-and-commit-conventions.md](./git-hooks-and-commit-conventions.md).

---

## Related documents

| Topic                            | Document                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Onboarding + new feature steps   | [getting-started.md](./getting-started.md)                                   |
| Feature module blueprint         | [feature-blueprint.md](./feature-blueprint.md)                               |
| Scope of the template            | [project-context.md](./project-context.md)                                   |
| Environment variables            | [env-configuration.md](./env-configuration.md)                               |
| Locales and dictionaries         | [internationalization.md](./internationalization.md)                         |
| HTTP client and errors           | [api-layer.md](./api-layer.md)                                               |
| Toasts vs retries, `AuthError`   | [api-error-handling.md](./api-error-handling.md)                             |
| TanStack Query defaults          | [data-fetching-and-react-query.md](./data-fetching-and-react-query.md)       |
| Theme tokens and semantic colors | [theming-and-design-tokens.md](./theming-and-design-tokens.md)               |
| Toast UX                         | [toast-system.md](./toast-system.md)                                         |
| Husky, lint-staged, commits      | [git-hooks-and-commit-conventions.md](./git-hooks-and-commit-conventions.md) |
| Common issues                    | [troubleshooting.md](./troubleshooting.md)                                   |
| Doc index                        | [README.md](./README.md)                                                     |
