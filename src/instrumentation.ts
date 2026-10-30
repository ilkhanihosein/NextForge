/**
 * Runs once when the server boots. In PGlite mode (local dev) it applies pending
 * migrations automatically, so a fresh clone works with no database setup at all.
 * Hosted Postgres is migrated explicitly with `npm run db:migrate` at deploy time.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const url = process.env.DATABASE_URL ?? "pglite://.data/db";
  if (!url.startsWith("pglite://")) return;

  const [{ db }, { runMigrations }] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/db/migrate"),
  ]);
  await runMigrations(db, url);
}
