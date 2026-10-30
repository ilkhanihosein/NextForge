import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Features expose a public surface; reaching into another feature's internals
      // couples them, so only the two entry files are importable from outside.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*", "!@/features/*/server"],
              message:
                "Import a feature through its public entry: @/features/<name> (client-safe) or @/features/<name>/server.",
            },
          ],
        },
      ],
    },
  },
  {
    // Inside a feature, relative and deep imports of itself are fine. The schema
    // aggregator and CLI scripts legitimately collect every feature's tables.
    files: ["src/features/**", "src/lib/db/schema.ts", "scripts/**"],
    rules: { "no-restricted-imports": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "drizzle/**"]),
]);
