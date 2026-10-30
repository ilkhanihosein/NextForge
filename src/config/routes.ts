/**
 * Route policy, locale-independent ("/admin" also covers "/fa/admin").
 * - protected: the proxy redirects to /login when there is no session cookie
 *   (pages still re-check on the server — the proxy is only the fast path).
 * - private: never indexed (robots.txt + X-Robots-Tag), whether protected or not.
 */
export const protectedRoutes = ["/admin", "/account"];

export const privateRoutes = [
  ...protectedRoutes,
  "/login",
  "/forgot-password",
  "/reset-password",
  "/accept-invite",
  "/design-system",
];

export const matchesRoute = (path: string, routes: string[]) =>
  routes.some((r) => path === r || path.startsWith(`${r}/`));
