import "server-only";
import { mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import {
  drizzle as drizzlePostgres,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

function createDatabase(): Database {
  const url = env.DATABASE_URL;
  if (url.startsWith("pglite://")) {
    const dir = url.slice("pglite://".length);
    mkdirSync(dir, { recursive: true });
    // Both drivers expose the same query builder; typing them as one keeps call sites simple.
    return drizzlePglite(new PGlite(dir), {
      schema,
      casing: "snake_case",
    }) as unknown as Database;
  }
  // `prepare: false` keeps it compatible with transaction-mode poolers (Neon, Supabase).
  const client = postgres(url, { prepare: false, max: 10 });
  return drizzlePostgres(client, { schema, casing: "snake_case" });
}

const globalForDb = globalThis as unknown as { __db?: Database };

function getDatabase() {
  // Reused across hot reloads so dev doesn't open a new connection per edit.
  return (globalForDb.__db ??= createDatabase());
}

/**
 * Connects on first use, not on import: the build (and any module that merely imports
 * `db`) never opens a connection, and static pages stay free of database work.
 */
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDatabase();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
