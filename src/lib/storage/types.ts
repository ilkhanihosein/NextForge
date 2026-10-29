export type Disposition = "inline" | "attachment";

export type UploadTarget = {
  url: string;
  method: "PUT";
  headers: Record<string, string>;
};

export type ObjectInfo = { size: number; contentType: string | null };

/**
 * Every driver speaks "presigned URL": the app authorizes a request, then hands the
 * browser a short-lived URL. Large files never stream through a server function on S3/R2,
 * and the local driver mimics the same contract so feature code is driver-agnostic.
 */
export interface StorageDriver {
  createUploadUrl(
    key: string,
    opts: { contentType: string; expiresIn?: number },
  ): Promise<UploadTarget>;
  createDownloadUrl(
    key: string,
    opts?: { expiresIn?: number; disposition?: Disposition; filename?: string; contentType?: string },
  ): Promise<string>;
  head(key: string): Promise<ObjectInfo | null>;
  /** Server-side read, e.g. to stream objects into a zip. */
  get(key: string): Promise<Response>;
  delete(key: string): Promise<void>;
}
