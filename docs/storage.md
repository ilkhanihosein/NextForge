# Storage

`src/lib/storage` exposes one `StorageDriver` interface with two implementations:

| Driver  | When          | How                                                                                                              |
| ------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `local` | dev (default) | files under `.data/storage`; `/api/storage/local` validates HMAC-signed, expiring tokens and supports HTTP Range |
| `s3`    | production    | Cloudflare R2 / S3 / MinIO via presigned URLs (aws4fetch, ~6 kB)                                                 |

Both use the **same presigned-URL contract**: the server authorizes the request, then hands the browser a short-lived URL. Uploads go straight to the bucket, and downloads stream from it with Range support for audio seeking and pdf.js. Nothing large passes through your server functions.

```ts
const { url, headers } = await storage.createUploadUrl(key, { contentType });
const downloadUrl = await storage.createDownloadUrl(key, {
  disposition: "attachment",
  filename,
});
```

Keep the bucket **private**. Files are reachable only through URLs your server signs after checking the session.

## Cloudflare R2 setup

1. Create a bucket (keep public access **off**).
2. Create an R2 API token with _Object Read & Write_ on that bucket and use its keys for `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`. `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`, `S3_REGION=auto`.
3. Add a CORS policy so the browser can upload and read directly:

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["content-type", "range"],
    "ExposeHeaders": ["content-length", "content-range", "accept-ranges"],
    "MaxAgeSeconds": 3600
  }
]
```
