"use server";

import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { recordAudit } from "@/features/audit/server";
import { isAdminRole, isOwnerRole } from "@/features/auth";
import {
  auth,
  requireAdmin,
  sendInvitation,
  verifyOwnPassword,
  type Session,
} from "@/features/auth/server";
import { fail, fromZodError, ok, type ActionResult } from "@/lib/action";
import { inviteUserSchema, setRoleSchema, userIdSchema } from "../schemas";
import { getUserById } from "../services/queries";

const ADMIN_USERS_PATH = "/[locale]/admin/users";
const refresh = () => revalidatePath(ADMIN_USERS_PATH, "page");

/*
 * Who may do what (the panel hides what you can't do, but this is the real gate):
 * - nobody acts on themself or on an owner;
 * - only an owner grants or removes admin rights, invites admins, or suspends/deletes
 *   an admin;
 * - granting admin rights and deleting an admin also need the owner's password again.
 * Every change is written to the activity log; changes to admin rights email the owners.
 */

const actorOf = (session: Session) => ({ id: session.user.id, name: session.user.name });

/** Loads the target and checks the actor may touch it at all. */
async function authorizeOn(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) return { error: fail("cannotModifySelf") } as const;
  const target = await getUserById(userId);
  if (!target) return { error: fail("notFound") } as const;
  if (isOwnerRole(target.role)) return { error: fail("ownerProtected") } as const;
  if (isAdminRole(target.role) && !isOwnerRole(session.user.role))
    return { error: fail("onlyOwner") } as const;
  return { session, target, error: null } as const;
}

/** Second factor for the riskiest changes: the actor's own password, checked again. */
async function checkPassword(session: Session, password: string | undefined) {
  if (!password) return fail("passwordRequired");
  if (await verifyOwnPassword(session.user.id, password)) return null;
  await recordAudit({ actor: actorOf(session), action: "passwordCheckFailed" });
  return fail("wrongPassword");
}

export async function inviteUserAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = inviteUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZodError(parsed.error);
  const { name, email, role, locale, password } = parsed.data;

  if (isAdminRole(role)) {
    if (!isOwnerRole(session.user.role)) return fail("onlyOwner");
    const denied = await checkPassword(session, password);
    if (denied) return denied;
  }

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
    await recordAudit({
      actor: actorOf(session),
      action: "userInvite",
      target: { id: user.id, label: `${name} <${email}>` },
      meta: { role },
      // Inviting a member is routine; inviting an admin is worth an email.
      alert: isAdminRole(role),
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
  const { session, target, error } = await authorizeOn(userId);
  if (error) return error;
  await sendInvitation({
    userId: target.id,
    email: target.email,
    name: target.name,
    locale,
    invitedById: session.user.id,
  });
  return ok(undefined, "inviteResent");
}

export async function setRoleAction(
  userId: string,
  role: string,
  password?: string,
): Promise<ActionResult> {
  const parsed = setRoleSchema.safeParse({ userId, role });
  if (!parsed.success) return fromZodError(parsed.error);
  const { session, target, error } = await authorizeOn(userId);
  if (error) return error;
  if (!isOwnerRole(session.user.role)) return fail("onlyOwner");
  if (target.role === role) return ok(undefined, "roleUpdated");
  if (isAdminRole(role)) {
    const denied = await checkPassword(session, password);
    if (denied) return denied;
  }

  const h = await headers();
  await auth.api.setRole({ body: { userId, role: role as "member" }, headers: h });
  // Sign them out everywhere so the new rights (or their loss) apply right away.
  await auth.api.revokeUserSessions({ body: { userId }, headers: h });
  await recordAudit({
    actor: actorOf(session),
    action: "userRole",
    target: { id: target.id, label: target.name },
    meta: { from: target.role, to: role },
  });
  refresh();
  return ok(undefined, "roleUpdated");
}

export async function setSuspendedAction(
  userId: string,
  suspended: boolean,
): Promise<ActionResult> {
  if (!userIdSchema.safeParse({ userId }).success) return fail("generic");
  const { session, target, error } = await authorizeOn(userId);
  if (error) return error;
  const h = await headers();
  // Banning also revokes every active session of the user.
  if (suspended) await auth.api.banUser({ body: { userId }, headers: h });
  else await auth.api.unbanUser({ body: { userId }, headers: h });
  await recordAudit({
    actor: actorOf(session),
    action: suspended ? "userSuspend" : "userReactivate",
    target: { id: target.id, label: target.name },
    meta: { role: target.role },
    alert: isAdminRole(target.role) && suspended,
  });
  refresh();
  return ok(undefined, suspended ? "suspended" : "reactivated");
}

export async function deleteUserAction(
  userId: string,
  password?: string,
): Promise<ActionResult> {
  if (!userIdSchema.safeParse({ userId }).success) return fail("generic");
  const { session, target, error } = await authorizeOn(userId);
  if (error) return error;
  if (isAdminRole(target.role)) {
    const denied = await checkPassword(session, password);
    if (denied) return denied;
  }
  await auth.api.removeUser({ body: { userId }, headers: await headers() });
  await recordAudit({
    actor: actorOf(session),
    action: "userDelete",
    target: { id: target.id, label: `${target.name} <${target.email}>` },
    meta: { role: target.role },
    alert: isAdminRole(target.role),
  });
  refresh();
  return ok(undefined, "deleted");
}
