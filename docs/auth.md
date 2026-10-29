# Auth & roles

Built on [Better Auth](https://better-auth.com) with the admin plugin. Config: `src/features/auth/services/auth.ts`.

## Invite-only onboarding

Public sign-up is disabled. An admin invites someone from **Admin → Users**:

1. `auth.api.createUser` creates the user **without a password** (the account can't sign in yet).
2. `sendInvitation` stores a **SHA-256 hash** of a random 256-bit token (7-day expiry) and emails the link, in the language the admin picked.
3. `/accept-invite?token=…` consumes the token **atomically** (single use), sets the credential password, marks the email verified and signs the user in.

Admins can resend invites, change roles, suspend (revokes all sessions) and delete users. Admins can't modify themselves. Bootstrap the first admin with `npm run admin:create`.

## Guards

| Layer                                 | What it does                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/proxy.ts`                        | Cookie-presence check for `protectedRoutes` → fast redirect to `/login?next=…`. **Optimistic only.** |
| `requireSession()` / `requireAdmin()` | Real check in layouts, pages and actions (validates the session, redirects).                         |
| `authorize({ admin })`                | For route handlers: returns 401/403 instead of redirecting.                                          |

## Roles & permissions

`src/features/auth/roles.ts` is the single source of truth (Better Auth access control). Add a resource to `statement`, grant actions per role, and add the role label to `admin.users.roles` in the messages.

## Hardening built in

Scrypt password hashing · rate limits on sign-in/reset (DB-backed, survives serverless) · reset tokens expire in 1 h and revoke other sessions · cookie cache (5 min) to avoid a DB hit per request · secure cookies on HTTPS · `next` redirect param restricted to same-site paths · no user enumeration on password reset.
