import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, roles } from "./roles";

/** Browser-side Better Auth client (same origin, so no baseURL needed). */
export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
});
