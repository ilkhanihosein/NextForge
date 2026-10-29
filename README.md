# NextForge v2

A **full-stack Next.js foundation** for shipping real products fast: feature-based architecture, multilingual routing, invite-only auth with roles, Postgres, transactional email, private object storage, and a glass design system with light/dark themes.

Every service has a **free tier** and the whole stack runs locally with **zero setup** (embedded Postgres, console email, filesystem storage).

| Concern   | Choice                                                                       | Free tier              |
| --------- | ---------------------------------------------------------------------------- | ---------------------- |
| Framework | Next.js 16 (App Router, Server Actions), React 19, TypeScript 6              | —                      |
| Styling   | Tailwind CSS 4, layered design tokens                                        | —                      |
| i18n      | next-intl: en (no prefix), fa, ar, de, ru; RTL for fa/ar; a font per script  | —                      |
| Auth      | Better Auth, invite-only, owner/admin/member, activity log, closed admin API | self-hosted            |
| Database  | Drizzle ORM · PGlite locally · any Postgres in prod                          | Neon: 0.5 GB           |
| Email     | Resend + React Email                                                         | 3,000 emails/month     |
| Storage   | S3-compatible presigned URLs (Cloudflare R2) · local driver in dev           | R2: 10 GB, free egress |
| Quality   | ESLint, Prettier, Vitest, Husky, lint-staged, Commitlint, GitHub Actions     | —                      |

## Quick start

```bash
npm install
cp .env.example .env.local          # works as-is for local dev
npm run admin:create -- you@example.com "Your Name"   # makes you the owner, prints a set-password link
npm run dev
```

Open the printed link (valid 24 h, one use), choose a password, and you're in the admin panel as the **owner**. Migrations run automatically in local (PGlite) mode.

> PGlite is single-process: stop `npm run dev` before running `admin:create` or `db:migrate` locally.

## Scripts

| Script                                            | Does                                                                                    |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `dev` / `build` / `start`                         | Next.js                                                                                 |
| `check`                                           | lint + typecheck + tests (also in CI)                                                   |
| `db:generate`                                     | create a migration from schema changes                                                  |
| `db:migrate`                                      | apply migrations to `DATABASE_URL` (run on deploy)                                      |
| `db:studio`                                       | Drizzle Studio                                                                          |
| `admin:create -- <email> "<name>" [--role admin]` | make an owner (default) or admin; prints a 24 h link if the account has no password yet |

## Structure

```txt
src/
  app/                    routes only — thin, compose features
    [locale]/(site)       public pages + account
    [locale]/(auth)       login, forgot/reset password, accept invite
    [locale]/admin        admin panel (requireAdmin in layout)
    api/                  auth handler, local storage endpoint
  features/<name>/        a vertical slice (see docs/architecture.md)
    index.ts              public UI + client API
    server.ts             public server API (services, queries)
    components/ actions/ services/ db/ emails/ schemas.ts
  components/ui           design-system primitives
  components/layout       header, footer, theme + locale switchers, aurora
  config/                 site identity, route policy
  i18n/                   routing, navigation, messages/{en,fa,ar,de,ru}.json
  lib/                    env, db, email, storage, seo, action helpers
  styles/globals.css      design tokens
```

## Docs

- [Architecture](docs/architecture.md): feature slices, layers, rules, adding a feature
- [Auth, roles & security](docs/auth.md): owner/admin/member, invite flow, the rules and where they're enforced, activity log, re-testing
- [Languages](docs/i18n.md): the five locales, fonts per script, adding a language, translation rules
- [Design system](docs/design-system.md): tokens, glass, components (Select, confirm dialogs, header), phone rules, CSS gotchas
- [Storage](docs/storage.md): presigned uploads/downloads, R2 setup
- [Deployment](docs/deployment.md): Neon, R2, Resend, env, migrations
- [Decisions](docs/decisions.md): why things are the way they are, and what's deferred

## Starting a new project from this

```bash
gh repo create my-app --private --template ilkhanihosein/NextForge
# or: npx degit ilkhanihosein/NextForge my-app
```

Then edit `src/config/site.ts`, the palette in `src/styles/globals.css`, and the messages in `src/i18n/messages/`.
