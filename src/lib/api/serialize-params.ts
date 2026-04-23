/**
 * Serializes query params so arrays become `key[]=v1&key[]=v2` (matches the HTTP client’s `paramsSerializer`).
 */
export const serializeParams = (params: Record<string, unknown>): string => {
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        pairs.push(
          `${encodeURIComponent(`${key}[]`)}=${encodeURIComponent(String(item))}`,
        );
      }
    } else if (typeof value === "boolean") {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value ? "1" : "0")}`);
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return pairs.join("&");
};
