# Troubleshooting

Quick fixes for local tooling and routing. For **auth / cookies / redirect** symptoms, also read [auth-system.md](./auth-system.md#common-issues-debugging) and the **Developer learning path** in [README.md](./README.md#developer-learning-path).

**Core stack:** [Documentation index](./README.md) · [Architecture](./architecture.md) · [API layer](./api-layer.md) · [Auth](./auth-system.md)

---

## Next.js: “inferred your workspace root” / multiple lockfiles

**Symptom:** `next build` warns that Turbopack picked a parent directory because another `package-lock.json` exists (e.g. under `$HOME`).

**Mitigation:** Keep a single lockfile scope for this project, or follow Next docs for **`turbopack.root`** in `next.config.ts` once your toolchain supports the config shape you need. Removing stray `package-lock.json` files outside the app folder is the cleanest fix.

---

## Husky: hooks do not run

**Symptom:** commits succeed without lint-staged.

**Checks:**

1. Is this directory a Git repo? (`git rev-parse --git-dir`)
2. Run **`npm run prepare`** after `git init`.
3. Are `.husky/pre-commit` and `.husky/commit-msg` executable? (`chmod +x .husky/*`)

---

## Locale 404 or redirect loop

**Symptom:** unknown locale or wrong redirect.

**Checks:**

1. **`src/config/site.ts`** — `locales` must include every segment you route under `[locale]`.
2. **`src/proxy.ts`** — matcher should align with Next’s proxy docs; only paths without a leading locale get prefixed with `defaultLocale`.

---

## Typecheck / ESLint errors from `tadawi/`

**Symptom:** diagnostics reference files under `tadawi/`.

**Expected:** `tadawi/` is **gitignored** and excluded from **`eslint.config.mjs`** and **`tsconfig.json`**. If you still see editor noise, restart the TS server or remove the folder locally.

---

## Environment variables not applied

**Symptom:** API calls still hit the default JSONPlaceholder URL.

**Checks:**

1. Use **`.env.local`** at the project root (Next convention).
2. Restart **`npm run dev`** after changing env files.
3. Only **`NEXT_PUBLIC_*`** keys are inlined for client-side code; server-only vars need Route Handlers / Server Components.

---

## Auth: API works but redirect to login on navigation

**Symptom:** `http` calls succeed with a Bearer token, but visiting **`/en/profile`** (or another protected route) sends you to login.

**Cause:** **`src/proxy.ts`** only sees **cookies**, not `localStorage`. If tokens were set without syncing cookies, the Edge gate has no session.

**Fix:** Ensure login (or recovery) goes through **`setSession`** from **`@/features/auth/session`**, or mount **`AuthSessionBootstrap`** so existing tokens are mirrored. See [auth-system.md](./auth-system.md).

---

## Auth: “authenticated” in code vs in UI

**Symptom:** confusion between **`isAuthenticated()`** (facade) and **`useAuth().isAuthenticated`**.

**Rule:** Facade = **access token present**. Hook property = **`auth/me` returned a user**. Details: [auth-system.md](./auth-system.md#naming-facade-vs-useauth).

---

## Related documents

| Topic        | Document                                                                     |
| ------------ | ---------------------------------------------------------------------------- |
| Env keys     | [env-configuration.md](./env-configuration.md)                               |
| Auth + session | [auth-system.md](./auth-system.md)                                        |
| i18n routing | [internationalization.md](./internationalization.md)                         |
| Git hooks    | [git-hooks-and-commit-conventions.md](./git-hooks-and-commit-conventions.md) |

**Core stack:** [Documentation index](./README.md) · [Architecture](./architecture.md) · [API layer](./api-layer.md) · [Auth](./auth-system.md)
