import { createReadStream } from "node:fs";
import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { signToken } from "./signed-token";
import type { Disposition, StorageDriver } from "./types";

export type LocalTokenPayload =
  | { op: "put"; key: string; contentType: string }
  | { op: "get"; key: string; disposition: Disposition; filename?: string; contentType?: string };

export const LOCAL_STORAGE_ROUTE = "/api/storage/local";

/** Resolves a key inside the storage root, refusing anything that escapes it. */
export function resolveLocalPath(root: string, key: string) {
  const base = path.resolve(root);
  const full = path.resolve(base, key);
  if (!full.startsWith(base + path.sep)) throw new Error("Invalid storage key");
  return full;
}

/** Filesystem driver for development. Same presigned-URL contract as S3/R2. */
export function createLocalDriver(config: { root: string; secret: string }): StorageDriver {
  // Relative on purpose: works on any host/port the dev server happens to run on.
  const tokenUrl = (payload: LocalTokenPayload, expiresIn: number) =>
    `${LOCAL_STORAGE_ROUTE}?token=${signToken(payload, config.secret, expiresIn)}`;

  return {
    async createUploadUrl(key, { contentType, expiresIn = 900 }) {
      const headers = { "content-type": contentType };
      return { url: tokenUrl({ op: "put", key, contentType }, expiresIn), method: "PUT", headers };
    },
    async createDownloadUrl(key, opts = {}) {
      return tokenUrl(
        { op: "get", key, disposition: opts.disposition ?? "inline", filename: opts.filename, contentType: opts.contentType },
        opts.expiresIn ?? 600,
      );
    },
    async head(key) {
      try {
        const info = await stat(resolveLocalPath(config.root, key));
        return { size: info.size, contentType: null };
      } catch {
        return null;
      }
    },
    async get(key) {
      const file = resolveLocalPath(config.root, key);
      const info = await stat(file);
      const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
      return new Response(stream, { headers: { "content-length": String(info.size) } });
    },
    async delete(key) {
      await rm(resolveLocalPath(config.root, key), { force: true });
    },
  };
}

export async function ensureDir(file: string) {
  await mkdir(path.dirname(file), { recursive: true });
}
