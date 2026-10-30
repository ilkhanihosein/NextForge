# Auth, roles & security

Built on [Better Auth](https://better-auth.com) with the admin plugin. Config: `src/features/auth/services/auth.ts`. Roles: `src/features/auth/roles.ts`. User management: `src/features/users`.

## Roles

| Role                                    | Can                                                                                              | Can't                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **owner**                               | everything an admin can, plus grant/remove admin rights, invite admins, suspend or delete admins | be suspended, demoted or deleted by anyone in the app; act on themself       |
| **admin**                               | invite, suspend, reactivate and delete members; manage content                                   | touch an owner or another admin; change any role; invite admins; see the log |
| **member** (`student` in some projects) | read content                                                                                     | open `/admin`                                                                |

- **Owners are made only from the command line** (`npm run admin:create`), never from the panel. Running it needs the code and the database credentials, i.e. the server itself. That is the deliberate "top" of the system: there is no hidden super-role inside the app (see [decisions](decisions.md)).
- More than one owner is allowed (e.g. the client and the developer).
- **In the panel the owner role is called "Super admin"** (مدیر ارشد, Super-Admin, المشرف العام, Суперадмин). A common setup is the developer as super admin and the client as admin: an "Owner" label next to someone else would read as "the site isn't yours". The role id in the code and the database stays `owner`. Handing over later: `npm run admin:create -- client@… "Name"` on the client's existing account makes them a super admin too, password untouched.
- No role has the admin plugin's dangerous permissions: **impersonation, setting another user's password or email, raw user updates**. One stolen admin session must not become a takeover of every account.

## Onboarding (invite-only)

Public sign-up is disabled (`disableSignUp`).

1. An admin opens **Admin → Users → Invite user**. Admins can only invite members; an owner can also pick **Admin**, and then has to type their own password again.
2. `auth.api.createUser` creates the user **without a password**, so the account can't sign in yet.
3. `sendInvitation` stores a **SHA-256 hash** of a random 256-bit token (7-day expiry) and emails the link in the chosen language.
4. `/accept-invite?token=…` consumes the token **atomically** (single use), sets the password, marks the email verified and signs the user in.

### First owner / recovery: `admin:create`

```bash
npm run admin:create -- you@example.com "Your Name"                    # owner (default)
npm run admin:create -- staff@example.com "Staff Name" --role admin     # admin
```

- A new or never-activated account gets a **one-time link valid 24 hours**, printed in the terminal. Open it yourself; don't paste it into chats or tickets.
- An account that already has a password **keeps it** and only gets the role (no link: a set-password link for an active account would be a second way in).
- Every run is written to the activity log as "Command line".
- PGlite is single-process: stop `npm run dev` first. In production run it with the production `DATABASE_URL`.

## The rules, and where they are enforced

The panel hides what you may not do, but **the server actions are the real gate**: `src/features/users/actions/user-actions.ts`.

| Action                              | Who          | Extra check                                     |
| ----------------------------------- | ------------ | ----------------------------------------------- |
| Invite a member                     | admin, owner | none                                            |
| Invite an admin                     | owner        | **owner's password**                            |
| Make someone admin                  | owner        | **owner's password**                            |
| Make an admin a member again        | owner        | confirmation                                    |
| Suspend / reactivate a member       | admin, owner | confirmation                                    |
| Suspend an admin                    | owner        | confirmation                                    |
| Delete a member                     | admin, owner | confirmation                                    |
| Delete an admin                     | owner        | **owner's password**                            |
| Anything on an owner or on yourself | nobody       | rejected (`ownerProtected`, `cannotModifySelf`) |

A wrong password is rejected and logged (`passwordCheckFailed`), and emails the owners.

### The admin plugin's HTTP API is closed

Better Auth exposes `/api/auth/admin/*` (create-user, set-role, set-user-password, impersonate-user, …). With those open, a stolen admin cookie could skip every rule above. `src/app/api/auth/[...all]/route.ts` answers **404** for that whole prefix (decoded and case-insensitive, so `/%61dmin/` doesn't slip through). Our server actions call `auth.api.*` directly in-process, which doesn't go over HTTP, so they keep working.

> Don't re-open these routes and don't call admin endpoints from the client (`authClient.admin.*`). New admin features = a server action with the same checks + `recordAudit`.

## Activity log & alerts

- Table `audit_log` (feature `src/features/audit`), page **Admin → Activity** (`/admin/activity`), **owners only**.
- Logged: invites (with role), role changes (from → to), suspend, reactivate, delete, failed password re-checks, plus whatever a project adds (e.g. resource deletions). Each entry stores who, what, target, time and IP. Names are copied in, so history survives deletions.
- Changes to admin rights **email every owner** ("Security notice"), with a link to the log. If the owner didn't do it, they know right away.
- Recording from a feature: `await recordAudit({ actor, action, target, meta, alert? })` from `@/features/audit/server`. New action names go in `src/features/audit/actions.ts` and `admin.activity.actions` in every messages file.

## Sessions

- 30-day sessions, refreshed daily. Signed session cookie cache of **60 seconds** (most requests skip the DB).
- `requireAdmin()` / `requireOwner()` and `authorize({ admin: true })` **always read the session from the database**, skipping the cookie cache: suspensions, role changes and revoked sessions stop admin access on the next request.
- A role change signs the user out everywhere; suspending also revokes all sessions. Ordinary member pages can keep working for up to the 60-second cache window.

## Guards

| Layer                                       | What it does                                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/proxy.ts`                              | Cookie-presence check for `protectedRoutes` → fast redirect to `/login?next=…`. **Optimistic only.** |
| `requireSession()`                          | Real check in member pages and actions.                                                              |
| `requireAdmin()` / `requireOwner()`         | Fresh (database) check for admin/owner pages and actions; redirects otherwise.                       |
| `authorize({ admin })`                      | For route handlers: 401/403 instead of redirecting.                                                  |
| `useConfirm()` / `useConfirmWithPassword()` | UI confirmation for risky actions. Convenience only: the server re-checks everything.                |

## Other hardening

Scrypt password hashing · minimum 10 characters · rate limits in production (sign-in 5/min, reset request 3 per 5 min, DB-backed so they survive serverless) · reset links expire in 1 h and revoke other sessions · secure cookies on HTTPS · requests from foreign origins rejected · `next` redirect limited to same-site paths · no user enumeration on password reset · security headers and CSP in `next.config.ts`.

## Re-testing (do this after auth changes)

With `npm run dev` running and the test accounts from `.data/DEV_CREDENTIALS.md`:

1. Sign in as a **member** with curl, then:
   - `POST /api/auth/update-user {"role":"admin"}` → `FIELD_NOT_ALLOWED`
   - any `/api/auth/admin/*` → `404`
   - `POST /api/auth/sign-up/email` → `EMAIL_PASSWORD_SIGN_UP_DISABLED`
2. Make the member an **admin** from the owner's panel (password needed), sign in as them and call the users server actions directly (action ids are in the page's JS chunks, `"<id>":{"name":"setSuspendedAction"}`) against the owner: every call must return `ownerProtected`.
3. Demote them again and check their old cookie: `GET /api/auth/get-session?disableCookieCache=true` → `null`, `/admin` → redirect.

## Not built yet (deliberately)

- **Two-factor login for owners/admins** (TOTP app, Better Auth `twoFactor` plugin). The biggest remaining win: a leaked password alone would no longer be enough.
- **Email one-time codes** at sign-in. Easier for users than TOTP, but weaker: whoever has the mailbox has the second factor.

See [decisions](decisions.md) for why and when.
