import "server-only";
import { env } from "@/lib/env";
import { createLocalDriver } from "./local-driver";
import { createS3Driver } from "./s3-driver";
import type { StorageDriver } from "./types";

export const storage: StorageDriver =
  env.STORAGE_DRIVER === "s3"
    ? createS3Driver({
        endpoint: env.S3_ENDPOINT!,
        region: env.S3_REGION,
        bucket: env.S3_BUCKET!,
        accessKeyId: env.S3_ACCESS_KEY_ID!,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      })
    : createLocalDriver({
        root: env.LOCAL_STORAGE_DIR,
        secret: env.BETTER_AUTH_SECRET,
      });

export { contentDisposition, safeFileName } from "./keys";
export type { Disposition, ObjectInfo, StorageDriver, UploadTarget } from "./types";
