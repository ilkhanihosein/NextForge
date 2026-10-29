# Deployment

Any Node host works (Vercel, Netlify, Railway, Fly, a VPS). The checklist:

1. **Postgres:** create a [Neon](https://neon.tech) project (free) and use the **pooled** connection string as `DATABASE_URL`.
2. **Secrets:** `BETTER_AUTH_SECRET` (`openssl rand -base64 32`) and `NEXT_PUBLIC_APP_URL=https://your-domain.com`.
3. **Email:** [Resend](https://resend.com) API key, verify your domain, set `EMAIL_FROM="Brand <hello@your-domain.com>"`.
4. **Storage:** R2 bucket + keys, `STORAGE_DRIVER=s3` (see [storage.md](storage.md)).
5. **Migrations:** run `npm run db:migrate` as part of the deploy (e.g. build command `npm run db:migrate && npm run build`).
6. **First owner:** `DATABASE_URL=… npm run admin:create -- you@domain.com "Name"`, then open the printed link yourself (24 h, one use). Further admins are invited from the panel by an owner. See [auth](auth.md).
7. **After deploy:** sign in as the owner, check **Admin → Activity**, and set a real `EMAIL_FROM`: security notices go to every owner by email.

The env is validated at boot (`src/lib/env.ts`): a missing production secret fails fast instead of running insecurely.
