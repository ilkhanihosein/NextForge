/**
 * Same-origin App Router handlers (`/api/auth/*`) must use an absolute URL so Axios
 * does not join them with `NEXT_PUBLIC_API_BASE_URL` (see Axios absolute URL behavior).
 */
export const authAppUrl = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${normalized}`;
  }
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (base) {
    return `${base}${normalized}`;
  }
  return `http://localhost:3000${normalized}`;
};
