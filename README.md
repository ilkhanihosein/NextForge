# Next.js Multilingual Starter

Production-ready **Next.js boilerplate** built with **TypeScript**, **App Router**, and **Tailwind CSS v4**.  
Designed for teams that want a clean architecture, fast onboarding, and scalable frontend foundations.

Keywords: **next.js starter**, **multilingual next.js**, **app router boilerplate**, **tailwind css template**, **dark mode next.js**, **react query axios setup**.

## Why This Starter

- Build multilingual products fast with localized routing (`en`, `fa`).
- Ship polished UI with built-in dark/light/system theming.
- Start with enterprise-friendly tooling (ESLint, Prettier, Husky, Commitlint).
- Use a modern data layer out of the box (`axios` + `@tanstack/react-query`).
- Keep code maintainable with a modular, scalable folder structure.

## Core Features

- **Next.js 16 + TypeScript + App Router**
- **Tailwind CSS v4** with design tokens and premium default theme
- **Internationalization (i18n)** via typed dictionaries
- **Theme system** (`next-themes`) with smooth toggling
- **Route progress bar** via `nprogress`
- **State management** with `zustand` + app context
- **Data fetching layer** with `axios` + React Query + Devtools
- **DX tooling**: ESLint, Prettier, lint-staged, Husky, Commitizen, Commitlint

## Tech Stack

- `next`, `react`, `typescript`
- `tailwindcss`
- `next-themes`
- `nprogress`
- `zustand`
- `axios`
- `@tanstack/react-query`
- `eslint`, `prettier`, `husky`, `lint-staged`, `commitlint`, `commitizen`

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

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

## Environment Variables

Use `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

## Project Structure

```txt
src/
  app/
    [locale]/                # localized routes and pages
    layout.tsx               # root app shell
    page.tsx                 # redirects to default locale
  components/
    home/                    # page-level components
    providers/               # app providers (theme/query/context)
    ui/                      # reusable UI controls
  config/                    # global constants and app settings
  context/                   # React context modules
  features/                  # feature-first modules (api/hooks/ui)
  i18n/                      # typed dictionaries and helpers
  lib/
    http/                    # axios client and interceptors
    react-query/             # query client config
    utils.ts                 # shared utility helpers
  store/                     # zustand stores
```

## Theming & Design Tokens

Theme tokens are defined in `src/app/globals.css` (`--background`, `--primary`, `--brand`, ...).
Update these variables to rebrand your product quickly without refactoring components.

## i18n Routing

- Default locale redirect: `/` -> `/{defaultLocale}`
- Localized pages: `/en`, `/fa`
- Locale-aware layout and dictionary loading in `app/[locale]`

## Data Layer Pattern

- Centralized HTTP client in `src/lib/http/api-client.ts`
- Centralized React Query config in `src/lib/react-query/query-client.ts`
- Feature queries under `src/features/*/api`

## Git Workflow Standards

This project uses commit quality gates:

- `pre-commit`: runs `lint-staged`
- `commit-msg`: validates Conventional Commits via `commitlint`
- `npm run commit`: guided commit messages using Commitizen

If this project is new, initialize git hooks:

```bash
git init
npm run prepare
```

## SEO Notes

This starter is SEO-ready by structure:

- Semantic App Router pages
- Locale-aware metadata support
- Fast, static-friendly rendering with SSG paths (`/en`, `/fa`)

Recommended next step: add `sitemap`, `robots`, Open Graph, and per-locale metadata templates.
