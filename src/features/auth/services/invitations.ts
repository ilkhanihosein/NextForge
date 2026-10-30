import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { localizedPath } from "@/i18n/paths";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { invitation, user } from "../db/schema";
import { InvitationEmail, emailSubject } from "../emails/auth-emails";
import { auth } from "./auth";

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Issues a fresh invite link (revoking older pending ones) and emails it. */
export async function sendInvitation(params: {
  userId: string;
  email: string;
  name: string;
  locale: string;
  invitedById?: string | null;
}) {
  const token = randomBytes(32).toString("base64url");

  await db.transaction(async (tx) => {
    await tx
      .delete(invitation)
      .where(and(eq(invitation.userId, params.userId), isNull(invitation.acceptedAt)));
    await tx.insert(invitation).values({
      id: randomUUID(),
      userId: params.userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      invitedById: params.invitedById ?? null,
    });
  });

  const url = `${env.NEXT_PUBLIC_APP_URL}${localizedPath("/accept-invite", params.locale)}?token=${token}`;
  await sendEmail({
    to: params.email,
    subject: await emailSubject(params.locale, "invitation"),
    react: await InvitationEmail({ locale: params.locale, name: params.name, url }),
  });
  return { url };
}

/** Looks up a pending, unexpired invitation without consuming it. */
export async function findPendingInvitation(token: string) {
  const [row] = await db
    .select({ id: invitation.id, userId: user.id, email: user.email, name: user.name })
    .from(invitation)
    .innerJoin(user, eq(user.id, invitation.userId))
    .where(
      and(
        eq(invitation.tokenHash, hashToken(token)),
        isNull(invitation.acceptedAt),
        gt(invitation.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return row ?? null;
}

/**
 * Consumes the invitation atomically (a second click can't reuse it), then sets the
 * user's credential password and marks the email verified — they proved ownership.
 */
export async function acceptInvitation(token: string, password: string) {
  const [consumed] = await db
    .update(invitation)
    .set({ acceptedAt: new Date() })
    .where(
      and(
        eq(invitation.tokenHash, hashToken(token)),
        isNull(invitation.acceptedAt),
        gt(invitation.expiresAt, new Date()),
      ),
    )
    .returning({ id: invitation.id, userId: invitation.userId });
  if (!consumed) return null;

  try {
    const ctx = await auth.$context;
    const hash = await ctx.password.hash(password);
    const accounts = await ctx.internalAdapter.findAccounts(consumed.userId);
    if (accounts.some((a) => a.providerId === "credential")) {
      await ctx.internalAdapter.updatePassword(consumed.userId, hash);
    } else {
      await ctx.internalAdapter.linkAccount({
        userId: consumed.userId,
        providerId: "credential",
        accountId: consumed.userId,
        password: hash,
      });
    }
    const [updated] = await db
      .update(user)
      .set({ emailVerified: true })
      .where(eq(user.id, consumed.userId))
      .returning({ email: user.email });
    return updated ?? null;
  } catch (error) {
    // Give the link back so the user can retry.
    await db
      .update(invitation)
      .set({ acceptedAt: null })
      .where(eq(invitation.id, consumed.id));
    throw error;
  }
}

/** Whether a user has finished onboarding (has a password). */
export async function hasPendingInvitation(userId: string) {
  const [row] = await db
    .select({ id: invitation.id })
    .from(invitation)
    .where(and(eq(invitation.userId, userId), isNull(invitation.acceptedAt)))
    .limit(1);
  return Boolean(row);
}
