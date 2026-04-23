# Git hooks and commit conventions

Automation and conventions that keep the repo **lint-clean** and commits **readable** before code lands on the default branch.

---

## npm scripts (quality gate)

There is **no** single `npm run check` script in `package.json` today. Run these locally (or compose them in CI):

| Script                 | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run format`       | Prettier write on the repo.                               |
| `npm run format:check` | Prettier check only (CI-friendly).                        |
| `npm run lint`         | ESLint on `.` (Next + TypeScript + Prettier integration). |
| `npm run lint:fix`     | ESLint with `--fix`.                                      |
| `npm run typecheck`    | `tsc --noEmit`.                                           |
| `npm run build`        | Next production build.                                    |

**Suggested CI one-liner:** `npm run format:check && npm run lint && npm run typecheck && npm run build`

---

## Husky and lint-staged

- **`prepare`** in `package.json` runs **`husky`** so hooks install after `npm install`.
- **`.husky/pre-commit`** runs **`npx lint-staged`**.
- **`lint-staged`** (in `package.json`):
  - **`*.js,jsx,ts,tsx,mjs,cjs`** → `eslint --fix`
  - **`*.json,md,css`** → `prettier --write`

**Important:** CI still runs full-repo **`format:check`** and **`lint`** without staged scope—hooks are a first line, not a substitute.

### First-time setup

If the repo was cloned fresh:

```bash
git init   # if not already a repo
npm run prepare
```

Without `.git`, `husky` prints a harmless notice; hooks activate once Git exists.

---

## Commitlint and Commitizen

- **`.husky/commit-msg`** runs **`npx --no -- commitlint --edit "$1"`** against [Conventional Commits](https://www.conventionalcommits.org/).
- **`commitlint.config.mjs`** extends **`@commitlint/config-conventional`**.
- **`npm run commit`** launches **Commitizen** with **`cz-git`** (types and limits configured under `"cz-git"` in `package.json`).

---

## ESLint + Prettier

- **`eslint.config.mjs`:** `eslint-config-next` + **`eslint-plugin-prettier`** recommended preset; **`tadawi/**`\*\* is ignored so local reference trees do not break lint.
- **`.prettierrc`**, **`.prettierignore`:** formatting scope and ignores.

---

## Optional: GitHub Actions

This template does **not** ship `.github/workflows/ci.yml`. Add a workflow that runs Node from `.nvmrc` (if you add one) or an explicit version, then `npm ci` and the suggested check one-liner above. Document any new secrets or env in [env-configuration.md](./env-configuration.md).

---

## Related documents

| Topic           | Document                                   |
| --------------- | ------------------------------------------ |
| Troubleshooting | [troubleshooting.md](./troubleshooting.md) |
| Architecture    | [architecture.md](./architecture.md)       |

**Core stack:** [Documentation index](./README.md) · [API layer](./api-layer.md) · [Auth](./auth-system.md)
