import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { siteConfig } from "@/config/site";
import { localeFromPath } from "@/i18n/paths";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import * as schema from "../db/schema";
import { ResetPasswordEmail, emailSubject } from "../emails/auth-emails";
import { ac, ADMIN_ROLES, DEFAULT_ROLE, roles } from "../roles";

export const auth = betterAuth({
  appName: siteConfig.name,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  // Production trusts only NEXT_PUBLIC_APP_URL. In development any localhost port is
  // accepted, so `npm run dev -- --port 3001` works without editing .env.local.
  trustedOrigins:
    env.NODE_ENV === "development"
      ? (request) => {
          const origin = request?.headers.get("origin");
          return origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
            ? [origin]
            : [];
        }
      : undefined,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      rateLimit: schema.rateLimit,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Invite-only: accounts are created by an admin, never through public sign-up.
    disableSignUp: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    async sendResetPassword({ user, url }) {
      const callback = new URL(url).searchParams.get("callbackURL") ?? "/";
      const locale = localeFromPath(new URL(callback, env.NEXT_PUBLIC_APP_URL).pathname);
      await sendEmail({
        to: user.email,
        subject: await emailSubject(locale, "resetPassword"),
        react: await ResetPasswordEmail({ locale, name: user.name, url }),
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    // Signed session snapshot in a cookie: most requests skip the session DB lookup. Kept
    // short so a suspended or signed-out-everywhere user loses the library within a
    // minute; admin pages and actions never use it (see requireAdmin).
    cookieCache: { enabled: true, maxAge: 60 },
  },
  rateLimit: {
    enabled: env.NODE_ENV === "production",
    // Database storage survives serverless cold starts, unlike the in-memory default.
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 300, max: 3 },
      "/reset-password": { window: 300, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: env.NEXT_PUBLIC_APP_URL.startsWith("https://"),
  },
  plugins: [
    admin({ ac, roles, defaultRole: DEFAULT_ROLE, adminRoles: ADMIN_ROLES }),
    nextCookies(), // must stay last: lets Server Actions set auth cookies
  ],
});

export type Session = typeof auth.$Infer.Session;
