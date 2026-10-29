/**
 * Grants owner (default) or admin rights from the command line, the only place an owner
 * can be made: it needs the code and the database credentials, i.e. the server itself.
 *   npm run admin:create -- you@example.com "Your Name"
 *   npm run admin:create -- staff@example.com "Staff Name" --role admin
 * A new or never-activated account gets a one-time link (valid 24 hours) to set its
 * password; an active account keeps its password and just gets the role.
 * With PGlite, stop `npm run dev` first (single-process database).
 */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import { auditLog } from "../src/features/audit/db/schema";
import { account, invitation, user } from "../src/features/auth/db/schema";

const args = process.argv.slice(2);
const roleFlag = args.indexOf("--role");
const role = roleFlag === -1 ? "owner" : args[roleFlag + 1];
const positional = args.filter((_, i) => i !== roleFlag && i !== roleFlag + 1);
const [email, ...nameParts] = positional;
if (!email || !email.includes("@") || (role !== "owner" && role !== "admin")) {
  console.error('Usage: npm run admin:create -- <email> "<name>" [--role owner|admin]');
  process.exit(1);
}
const name = nameParts.join(" ") || email.split("@")[0]!;
const url = process.env.DATABASE_URL ?? "pglite://.data/db";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function connect() {
  if (url.startsWith("pglite://")) {
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = url.slice("pglite://".length);
    mkdirSync(dir, { recursive: true });
    const client = new PGlite(dir);
    const db = drizzlePglite(client, { casing: "snake_case" });
    await migratePglite(db, { migrationsFolder: "./drizzle" });
    return {
      db: db as unknown as ReturnType<typeof drizzlePostgres>,
      close: () => client.close(),
    };
  }
  const postgres = (await import("postgres")).default;
  const client = postgres(url, { max: 1, prepare: false });
  return {
    db: drizzlePostgres(client, { casing: "snake_case" }),
    close: () => client.end(),
  };
}

const { db, close } = await connect();
const normalized = email.trim().toLowerCase();
const [existing] = await db
  .select()
  .from(user)
  .where(eq(user.email, normalized))
  .limit(1);
const userId = existing?.id ?? randomUUID();

if (existing) {
  await db.update(user).set({ role, banned: false }).where(eq(user.id, userId));
} else {
  await db
    .insert(user)
    .values({ id: userId, email: normalized, name, role, emailVerified: false });
}

// An account that already has a password keeps it: issuing a set-password link for it
// would just create a second way into that account.
const [credential] = await db
  .select({ id: account.id })
  .from(account)
  .where(and(eq(account.userId, userId), eq(account.providerId, "credential")))
  .limit(1);

let token: string | null = null;
if (!credential) {
  token = randomBytes(32).toString("base64url");
  await db.delete(invitation).where(eq(invitation.userId, userId));
  await db.insert(invitation).values({
    id: randomUUID(),
    userId,
    tokenHash: createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
}

// Shows up in the activity log next to changes made from the panel.
await db.insert(auditLog).values({
  id: randomUUID(),
  actorId: null,
  actorName: "Command line",
  action: existing ? "userRole" : "userInvite",
  targetId: userId,
  targetLabel: `${existing?.name ?? name} <${normalized}>`,
  meta: existing ? { from: existing.role, to: role } : { role },
});
await close();

console.info(`\n✓ ${existing ? "Updated" : "Created"} ${role} ${normalized}`);
if (token) {
  console.info(
    `  Open this link yourself to set the password (one use, valid 24 hours).\n` +
      `  Don't paste it into chats or tickets:\n  ${appUrl}/accept-invite?token=${token}\n`,
  );
} else {
  console.info("  The account already has a password; it can sign in as before.\n");
}
