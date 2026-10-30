import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "./signed-token";
import { resolveLocalPath } from "./local-driver";
import { safeFileName } from "./keys";

const secret = "x".repeat(32);

describe("signed tokens", () => {
  it("round-trips a payload", () => {
    const token = signToken({ op: "get", key: "a/b.pdf" }, secret, 60);
    expect(verifyToken<{ key: string }>(token, secret)?.key).toBe("a/b.pdf");
  });

  it("rejects a tampered payload or wrong secret", () => {
    const token = signToken({ key: "a" }, secret, 60);
    const [, sig] = token.split(".");
    const forged = `${Buffer.from(JSON.stringify({ key: "b", exp: 9e9 })).toString("base64url")}.${sig}`;
    expect(verifyToken(forged, secret)).toBeNull();
    expect(verifyToken(token, "y".repeat(32))).toBeNull();
  });

  it("rejects expired tokens", () => {
    expect(verifyToken(signToken({ key: "a" }, secret, -1), secret)).toBeNull();
  });
});

describe("storage keys", () => {
  it("blocks path traversal", () => {
    expect(() => resolveLocalPath("/srv/data", "../etc/passwd")).toThrow();
    expect(resolveLocalPath("/srv/data", "a/b.pdf")).toBe("/srv/data/a/b.pdf");
  });

  it("sanitizes file names", () => {
    expect(safeFileName("My Book (v2).PDF")).toBe("My-Book-v2.pdf");
    expect(safeFileName("../../x.mp3")).toBe("x.mp3");
  });
});
