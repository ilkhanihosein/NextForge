import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "pglite://.data/db";
const isPglite = url.startsWith("pglite://");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  ...(isPglite
    ? { driver: "pglite", dbCredentials: { url: url.replace("pglite://", "") } }
    : { dbCredentials: { url } }),
  casing: "snake_case",
  strict: true,
  verbose: true,
});
