# Documentation index

These files describe **how this Next.js boilerplate is wired**, so you can keep the patterns, delete optional pieces, or extend them in your own project.

**Data layer:** start simple with **`http.get`**, scale to **request descriptors** (`api.*`) when the app grows — see [api-layer.md](./api-layer.md).

| Document                                                                     | Description                                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [project-context.md](./project-context.md)                                   | What this repo is (Next.js App Router stack) and what it deliberately does not include.             |
| [architecture.md](./architecture.md)                                         | Layers: `app/`, `proxy`, `features/`, `lib/api`, providers, i18n, and how requests flow to the API. |
| [env-configuration.md](./env-configuration.md)                               | `NEXT_PUBLIC_*` variables, `.env.example`, and recommendations for a future Zod `env` module.       |
| [internationalization.md](./internationalization.md)                         | Locale routing, dictionaries, RTL, and the Baloo Bhaijaan 2 font hook for `fa`.                     |
| [api-layer.md](./api-layer.md)                                               | **Quick start** (`http` + React Query), core concepts, **advanced** descriptors / `RequestOptions` / interceptors. |
| [api-error-handling.md](./api-error-handling.md)                             | **At a glance** summary, then layers, silent retries, `meta`, antipatterns.                         |
| [data-fetching-and-react-query.md](./data-fetching-and-react-query.md)       | Quick start, `QueryClient` defaults, global toasts, `queryOptions`, optional descriptor pattern.   |
| [theming-and-design-tokens.md](./theming-and-design-tokens.md)               | CSS variables, `next-themes`, semantic success/error/info/warning tokens.                           |
| [toast-system.md](./toast-system.md)                                         | Sonner + Framer Motion toasts, RTL/Farsi, `appToast` API.                                           |
| [git-hooks-and-commit-conventions.md](./git-hooks-and-commit-conventions.md) | Husky, lint-staged, Commitlint, Commitizen (`cz-git`).                                              |
| [troubleshooting.md](./troubleshooting.md)                                   | Turbopack lockfile warning, hooks not running, locale 404s.                                         |
