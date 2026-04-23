# Environment configuration

## Files

- **`.env.example`** — template for developers. Copy to **`.env.local`** for local values (Next.js loads `.env.local` automatically).
- **`.gitignore`** — the pattern **`.env*`** also matches **`.env.example`**. If Git does not list `.env.example` as tracked, add an exception in `.gitignore`, for example:

  ```gitignore
  .env*
  !.env.example
  ```

## Variables (current)

| Variable                   | Required | Description                                                                                                              |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | No       | Default API base (`BASE_URLS.default`). Defaults to `https://jsonplaceholder.typicode.com` if unset.                     |
| `NEXT_PUBLIC_API_CORE_URL` | No       | Optional second base (`BASE_URLS.core`). If unset, the core client reuses the same Axios instance as the default client. |

**Convention:** only non-secrets belong in `NEXT_PUBLIC_*`. Never put server-only secrets in `NEXT_PUBLIC_` variables—they are exposed to the browser bundle.

## Future hardening (recommended)

1. Add **`src/config/env.ts`** with **Zod** parsing `process.env` at startup (server) or a small validated subset for client.
2. Mirror every required key in **`.env.example`** with placeholder values.
3. For server-only secrets (e.g. internal API keys), use **unprefixed** names and read them only in **Server Components**, **Route Handlers**, or **Server Actions**—never pass them to client components.

## Related documents

| Topic                      | Document                             |
| -------------------------- | ------------------------------------ |
| Architecture               | [architecture.md](./architecture.md) |
| HTTP client base URL usage | [api-layer.md](./api-layer.md)       |
