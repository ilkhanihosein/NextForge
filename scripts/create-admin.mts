/**
 * Bootstraps an admin and prints (and emails) their invitation link.
 *   npm run admin:create -- you@example.com "Your Name"
 * With PGlite, stop `npm run dev` first (single-process database).
 */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { invitation, user } from "../src/features/auth/db/schema";

const [email, ...nameParts] = process.argv.slice(2);
if (!email || !email.includes("@")) {
  console.error('Usage: npm run admin:create -- <email> "<name>"');
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
  await db.update(user).set({ role: "admin", banned: false }).where(eq(user.id, userId));
} else {
  await db
    .insert(user)
    .values({ id: userId, email: normalized, name, role: "admin", emailVerified: false });
}

const token = randomBytes(32).toString("base64url");
await db.delete(invitation).where(eq(invitation.userId, userId));
await db.insert(invitation).values({
  id: randomUUID(),
  userId,
  tokenHash: createHash("sha256").update(token).digest("hex"),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
});
await close();

console.info(`\n✓ ${existing ? "Promoted" : "Created"} admin ${normalized}`);
console.info(
  `  Set the password here (valid 7 days):\n  ${appUrl}/accept-invite?token=${token}\n`,
);
