import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import type { Database } from "./client";

export async function runMigrations(db: Database, url: string) {
  const config = { migrationsFolder: "./drizzle" };
  if (url.startsWith("pglite://")) {
    await migratePglite(db as unknown as Parameters<typeof migratePglite>[0], config);
  } else {
    await migratePostgres(db, config);
  }
}
