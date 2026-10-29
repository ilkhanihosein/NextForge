import "server-only";
import { auth } from "./auth";

/**
 * Re-checks the signed-in user's own password before an action that is hard to undo
 * (granting admin, removing an admin). A stolen session cookie alone isn't enough then.
 */
export async function verifyOwnPassword(userId: string, password: string) {
  if (!password) return false;
  const ctx = await auth.$context;
  const accounts = await ctx.internalAdapter.findAccounts(userId);
  const hash = accounts.find((a) => a.providerId === "credential")?.password;
  if (!hash) return false;
  return ctx.password.verify({ hash, password });
}
