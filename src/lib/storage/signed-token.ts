import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Compact HMAC-signed tokens (payload.signature, base64url). Used by the local storage
 * driver to emulate presigned URLs; expiry is part of the signed payload.
 */
export function signToken<T extends object>(payload: T, secret: string, expiresInSec: number) {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSec }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken<T extends object>(token: string, secret: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as T & { exp: number };
    return payload.exp >= Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}
