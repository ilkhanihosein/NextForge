"use server";

import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth, requireAdmin, sendInvitation } from "@/features/auth/server";
import { fail, fromZodError, ok, type ActionResult } from "@/lib/action";
import { inviteUserSchema, setRoleSchema, userIdSchema } from "../schemas";
import { getUserById } from "../services/queries";

const ADMIN_USERS_PATH = "/[locale]/admin/users";
const refresh = () => revalidatePath(ADMIN_USERS_PATH, "page");

export async function inviteUserAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = inviteUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZodError(parsed.error);
  const { name, email, role, locale } = parsed.data;

  try {
    const { user } = await auth.api.createUser({
      // No password: the account is unusable until the invitee sets one.
      body: { email, name, role: role as "member" },
      headers: await headers(),
    });
    await sendInvitation({
      userId: user.id,
      email,
      name,
      locale,
      invitedById: session.user.id,
    });
  } catch (error) {
    if (error instanceof APIError && /exist/i.test(error.message))
      return fail("emailTaken");
    console.error("[users] invite failed", error);
    return fail("generic");
  }

  refresh();
  return ok(undefined, "invited");
}

export async function resendInviteAction(
  userId: string,
  locale: string,
): Promise<ActionResult> {
  const session = await requireAdmin();
  const target = await getUserById(userId);
  if (!target) return fail("notFound");
  await sendInvitation({
    userId: target.id,
    email: target.email,
    name: target.name,
    locale,
    invitedById: session.user.id,
  });
  return ok(undefined, "inviteResent");
}

/** Guards against an admin locking themself out. */
async function guardTarget(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) return { error: fail("cannotModifySelf") };
  return { error: null };
}

export async function setRoleAction(userId: string, role: string): Promise<ActionResult> {
  const parsed = setRoleSchema.safeParse({ userId, role });
  if (!parsed.success) return fromZodError(parsed.error);
  const { error } = await guardTarget(userId);
  if (error) return error;
  await auth.api.setRole({
    body: { userId, role: role as "member" },
    headers: await headers(),
  });
  refresh();
  return ok(undefined, "roleUpdated");
}

export async function setSuspendedAction(
  userId: string,
  suspended: boolean,
): Promise<ActionResult> {
  if (!userIdSchema.safeParse({ userId }).success) return fail("generic");
  const { error } = await guardTarget(userId);
  if (error) return error;
  const h = await headers();
  // Banning also revokes every active session of the user.
  if (suspended) await auth.api.banUser({ body: { userId }, headers: h });
  else await auth.api.unbanUser({ body: { userId }, headers: h });
  refresh();
  return ok(undefined, suspended ? "suspended" : "reactivated");
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  if (!userIdSchema.safeParse({ userId }).success) return fail("generic");
  const { error } = await guardTarget(userId);
  if (error) return error;
  await auth.api.removeUser({ body: { userId }, headers: await headers() });
  refresh();
  return ok(undefined, "deleted");
}
