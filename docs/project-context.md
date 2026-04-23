# Project context

This repository is a **Next.js 16** application boilerplate, not a standalone REST API service.

## What it is

- **Framework:** Next.js App Router, React 19, TypeScript.
- **Styling:** Tailwind CSS v4 with design tokens in CSS variables.
- **Rendering:** Server Components by default; Client Components where interactivity is required (`"use client"`).
- **Data:** Axios-based HTTP client (`src/lib/api/`) plus TanStack Query for client-side caching and mutations.
- **i18n:** Locale-prefixed routes (`/en`, `/fa`) with typed dictionaries—no `next-intl` package in this template.
- **Quality:** ESLint (Next config + Prettier), Prettier, Husky, lint-staged, Commitlint, Commitizen.

## What it is not (by default)

- No MongoDB, no Express server inside this app (use Route Handlers under `src/app/api/` if you need backend endpoints).
- No Zod `env` schema in-repo yet—environment variables are read where needed (see [env-configuration.md](./env-configuration.md)); you can add `src/config/env.ts` with Zod as a next step.
- No Vitest/Jest in `package.json` today—quality gate is **lint + typecheck + build**.

## Reference sample folder

The `tadawi/` directory (if present locally) is an **optional benchmark** only: it is listed in `.gitignore` and excluded from ESLint/TypeScript so it does not affect CI or editor diagnostics. Do not treat it as part of the shipped product code.
