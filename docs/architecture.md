# Architecture

## Feature slices

Code is grouped by **what it does for the product**, not by technical type. Each feature in `src/features/<name>/` is a vertical slice that owns its UI, server logic, data and copy:

```txt
features/resources/
  index.ts        ← public: components, client helpers, types (what pages render)
  server.ts       ← public: services/queries for Server Components & route handlers
  components/     React components (server or "use client")
  actions/        "use server" mutations, each validates input + authorizes
  services/       server-only domain logic and data access ("server-only")
  db/schema.ts    Drizzle tables owned by this feature
  emails/         React Email templates
  schemas.ts      Zod schemas shared by client and server
```

**Rules** (lint-enforced where possible):

1. Outside a feature, import only `@/features/<name>` or `@/features/<name>/server`. Internals are private (`no-restricted-imports`).
2. Features may depend on other features' public entries and on `lib/`, `components/`, `config/`, `i18n/`. `lib/` never imports features (except the schema aggregator).
3. Routes in `app/` are thin: read params, call a guard, call a service, render feature components.
4. Every mutation is a Server Action or route handler that **validates with Zod** and **authorizes on the server**; the proxy is never the only gate.

## Data flow

- **Reads:** Server Component → `features/x/server` service → Drizzle. No client data-fetching library is needed for most screens.
- **Writes:** form → Server Action (`ActionResult`) → service → `revalidatePath`. Client components use `useActionState`/`useTransition`.
- **Auth state on public pages** is read client-side (`authClient.useSession`) so those pages stay static.

## Rendering

Public pages are statically generated per locale (`generateStaticParams` + `setRequestLocale` in every layout/page). Private pages are dynamic and `noindex`. The database client connects lazily on first query, so builds never touch the DB.

## Adding a feature

1. `mkdir src/features/<name>` with the layout above.
2. Tables in `db/schema.ts`, then export them from `src/lib/db/schema.ts` and run `npm run db:generate`.
3. Messages under a `<name>` namespace in every `src/i18n/messages/*.json`.
4. Routes in `src/app/[locale]/…`; admin screens register in `src/features/admin/nav.ts`.
5. Private routes go in `src/config/routes.ts` (`protectedRoutes` / `privateRoutes`).
