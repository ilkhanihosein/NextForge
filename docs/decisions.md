# Decisions

Why things are the way they are, newest first. Add an entry whenever a choice isn't obvious from the code.

## 2026-10-30 · Security model for admins

- **Owner role**, created from the CLI only. Only owners change admin rights or act on admins; nobody acts on an owner. _Why:_ before this, one stolen admin session could create more admins, reset the real owner's password and lock them out, silently.
- **Closed `/api/auth/admin/*`** over HTTP; admin work only through server actions. _Why:_ the admin plugin's endpoints (set-user-password, impersonate, create-user with a password) bypassed every app rule.
- **Password re-check** for granting admin, inviting an admin and deleting an admin. _Why:_ a stolen cookie alone mustn't be enough for the riskiest changes.
- **Activity log + email to owners** for changes to admin rights. _Why:_ if it wasn't the owner, they find out the same minute.
- **No hidden "god" role.** It was considered and rejected: a role that's listed nowhere is a backdoor, powerful and invisible, with no trail. If it leaks, the attacker is the strongest user and nobody notices. The top of the system is the server itself: `npm run admin:create` needs the code and the database credentials.
- **Deferred:** two-factor login (TOTP) for owners/admins, and email one-time codes at sign-in. TOTP is the next security step when there's time; email codes are easier but weaker (the mailbox becomes the second factor). Not needed for the MVP.

## 2026-10-30 · Five languages

- en (default, unprefixed), fa, ar, de, ru. Arabic and Persian are RTL.
- Each script has its own type; non-Latin faces aren't preloaded so a page only downloads what it uses.
- The picker shows each language only in its own name (no translated second line: tried, looked cluttered).
- Translations are written to read naturally, not word for word (the first Persian pass was literal and was rewritten).
- Turkish was considered but not added: every language is hundreds of strings to keep correct. Adding one is a config line + a messages file ([i18n](i18n.md)).

## 2026-10-30 · UI building blocks

- **Select on Base UI** (headless, from the Radix/Floating UI people) instead of native `<select>` or a home-made listbox: accessibility, keyboard and positioning are the hard parts, and they're done; the look is ours.
- **App-wide confirm dialog** (`useConfirm`) instead of `window.confirm`, for every destructive or sensitive action (suspend, reactivate, delete, role change, …).
- **Self-measuring header** instead of per-language breakpoints: labels in German/Russian are much longer, and only the browser knows the real width.

## 2026-10-29 · Phones and tablets

- A menu holds whatever the header can't fit, at every width, so no control disappears on small screens (theme, language and sign-out used to).
- Horizontal overflow is clipped on `html` and `body`; see the phone rules in [design-system](design-system.md).

## 2026-10-29 · Stack (v2 rebuild)

- Next.js 16 App Router + Server Actions, React 19, Tailwind 4, next-intl, Better Auth, Drizzle (PGlite locally, Postgres in production), Resend, S3-compatible storage (Cloudflare R2).
- **TypeScript pinned to ~6.0** (typescript-eslint doesn't support TS 7 yet) and **ESLint 9** (eslint-plugin-react limits). Revisit when they catch up.
- Feature-based architecture, front and back in one codebase ([architecture](architecture.md)).
- Only services with a free tier; hosting is chosen per project.
