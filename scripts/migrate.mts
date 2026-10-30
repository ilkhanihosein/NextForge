/**
 * Applies drizzle migrations to DATABASE_URL. With PGlite, stop `npm run dev` first:
 * the embedded database is single-process.
 */
import { mkdirSync } from "node:fs";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL ?? "pglite://.data/db";
const migrationsFolder = "./drizzle";

if (url.startsWith("pglite://")) {
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = url.slice("pglite://".length);
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  await migratePglite(drizzlePglite(client), { migrationsFolder });
  await client.close();
} else {
  const postgres = (await import("postgres")).default;
  const client = postgres(url, { max: 1, prepare: false });
  await migratePostgres(drizzlePostgres(client), { migrationsFolder });
  await client.end();
}
console.info("✓ migrations applied");
