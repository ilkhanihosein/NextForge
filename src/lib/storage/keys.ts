/** Turns any user-provided filename into a safe, readable object-key segment. */
export function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFKD")
    .replace(/[^\w\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const ext = dot > 0 ? name.slice(dot + 1).replace(/[^a-z0-9]/gi, "").slice(0, 8).toLowerCase() : "";
  return `${base || "file"}${ext ? `.${ext}` : ""}`;
}

export function contentDisposition(disposition: "inline" | "attachment", filename?: string) {
  if (!filename) return disposition;
  const ascii = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "");
  return `${disposition}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
