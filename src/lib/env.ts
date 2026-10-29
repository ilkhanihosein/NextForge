import "server-only";
import { z } from "zod";

const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const isProd = process.env.NODE_ENV === "production" && !isBuild;

const DEV_SECRET = "dev-only-secret-change-me-dev-only-secret-change-me";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    /** `pglite://<dir>` for zero-setup local dev, or a postgres:// URL (e.g. Neon). */
    DATABASE_URL: z.string().min(1).default("pglite://.data/db"),
    BETTER_AUTH_SECRET: z.string().min(32).default(DEV_SECRET),

    /** Without a key, emails are printed to the server console instead of sent. */
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default("NextForge <onboarding@resend.dev>"),

    STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
    LOCAL_STORAGE_DIR: z.string().default(".data/storage"),
    /** S3-compatible (Cloudflare R2: https://<account>.r2.cloudflarestorage.com). */
    S3_ENDPOINT: z.url().optional(),
    S3_REGION: z.string().default("auto"),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (isProd && env.BETTER_AUTH_SECRET === DEV_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_SECRET"],
        message: "Required in production",
      });
    }
    if (env.STORAGE_DRIVER === "s3") {
      for (const key of [
        "S3_ENDPOINT",
        "S3_BUCKET",
        "S3_ACCESS_KEY_ID",
        "S3_SECRET_ACCESS_KEY",
      ] as const) {
        if (!env[key])
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Required when STORAGE_DRIVER=s3",
          });
      }
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
