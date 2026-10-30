import { AwsClient } from "aws4fetch";
import { contentDisposition } from "./keys";
import type { StorageDriver } from "./types";

type S3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

/** S3-compatible driver (Cloudflare R2, AWS S3, MinIO…) built on the 6 kB aws4fetch. */
export function createS3Driver(config: S3Config): StorageDriver {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: config.region,
  });
  const objectUrl = (key: string) =>
    new URL(`${config.endpoint.replace(/\/$/, "")}/${config.bucket}/${key.split("/").map(encodeURIComponent).join("/")}`);

  async function presign(url: URL, method: string, expiresIn: number, headers?: Record<string, string>) {
    url.searchParams.set("X-Amz-Expires", String(expiresIn));
    const signed = await client.sign(new Request(url, { method, headers }), {
      aws: { signQuery: true, allHeaders: Boolean(headers) },
    });
    return signed.url;
  }

  return {
    async createUploadUrl(key, { contentType, expiresIn = 900 }) {
      const headers = { "content-type": contentType };
      return { url: await presign(objectUrl(key), "PUT", expiresIn, headers), method: "PUT", headers };
    },
    async createDownloadUrl(key, opts = {}) {
      const url = objectUrl(key);
      url.searchParams.set(
        "response-content-disposition",
        contentDisposition(opts.disposition ?? "inline", opts.filename),
      );
      if (opts.contentType) url.searchParams.set("response-content-type", opts.contentType);
      return presign(url, "GET", opts.expiresIn ?? 600);
    },
    async head(key) {
      const res = await client.fetch(objectUrl(key), { method: "HEAD" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Storage HEAD failed: ${res.status}`);
      return { size: Number(res.headers.get("content-length") ?? 0), contentType: res.headers.get("content-type") };
    },
    async get(key) {
      const res = await client.fetch(objectUrl(key));
      if (!res.ok) throw new Error(`Storage GET failed: ${res.status}`);
      return res;
    },
    async delete(key) {
      const res = await client.fetch(objectUrl(key), { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new Error(`Storage DELETE failed: ${res.status}`);
    },
  };
}
