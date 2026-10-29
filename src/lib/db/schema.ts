/**
 * Aggregates every feature's tables for drizzle-kit and the typed `db` client.
 * Each feature owns its tables in `src/features/<name>/db/schema.ts`; register them here.
 */
export * from "@/features/audit/db/schema";
export * from "@/features/auth/db/schema";
