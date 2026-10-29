import { createReadStream, createWriteStream } from "node:fs";
import { rename, stat } from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import { env } from "@/lib/env";
import { contentDisposition } from "@/lib/storage";
import { ensureDir, resolveLocalPath, type LocalTokenPayload } from "@/lib/storage/local-driver";
import { verifyToken } from "@/lib/storage/signed-token";

/**
 * Backs the local storage driver: validates the signed token exactly like S3 validates a
 * presigned URL. Not used when STORAGE_DRIVER=s3.
 */
export const dynamic = "force-dynamic";

function readToken<T extends LocalTokenPayload["op"]>(request: Request, op: T) {
  if (env.STORAGE_DRIVER !== "local") return null;
  const token = new URL(request.url).searchParams.get("token");
  const payload = token ? verifyToken<LocalTokenPayload>(token, env.BETTER_AUTH_SECRET) : null;
  return payload?.op === op ? (payload as Extract<LocalTokenPayload, { op: T }>) : null;
}

export async function GET(request: Request) {
  const payload = readToken(request, "get");
  if (!payload) return new Response("Forbidden", { status: 403 });

  const file = resolveLocalPath(env.LOCAL_STORAGE_DIR, payload.key);
  const info = await stat(file).catch(() => null);
  if (!info) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "accept-ranges": "bytes",
    "content-type": payload.contentType ?? "application/octet-stream",
    "content-disposition": contentDisposition(payload.disposition, payload.filename),
    "cache-control": "private, max-age=300",
    "x-robots-tag": "noindex, nofollow",
  });

  // Range support lets audio seek and pdf.js load pages on demand.
  const range = request.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
    if (start > end || start >= info.size) {
      return new Response(null, { status: 416, headers: { "content-range": `bytes */${info.size}` } });
    }
    headers.set("content-range", `bytes ${start}-${end}/${info.size}`);
    headers.set("content-length", String(end - start + 1));
    const stream = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
    return new Response(stream, { status: 206, headers });
  }

  headers.set("content-length", String(info.size));
  return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, { headers });
}

export async function PUT(request: Request) {
  const payload = readToken(request, "put");
  if (!payload || !request.body) return new Response("Forbidden", { status: 403 });
  if (request.headers.get("content-type") !== payload.contentType) {
    return new Response("Content-Type mismatch", { status: 400 });
  }

  const file = resolveLocalPath(env.LOCAL_STORAGE_DIR, payload.key);
  await ensureDir(file);
  const temp = `${file}.uploading`;
  await request.body.pipeTo(Writable.toWeb(createWriteStream(temp)));
  await rename(temp, file);
  return new Response(null, { status: 200 });
}
