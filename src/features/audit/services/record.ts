import "server-only";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { user } from "@/features/auth/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { ALERT_ACTIONS, type AuditAction } from "../actions";
import { auditLog } from "../db/schema";
import { SecurityAlertEmail, securityAlertSubject } from "../emails/security-alert";

type Entry = {
  actor: { id: string; name: string };
  action: AuditAction;
  target?: { id: string; label: string };
  meta?: Record<string, string>;
  /** Email the owners even for an action that normally doesn't (e.g. granting admin). */
  alert?: boolean;
};

/**
 * Writes one entry to the activity log. Changes to admin rights also email every owner,
 * so a hijacked session can't quietly make itself at home.
 */
export async function recordAudit({ actor, action, target, meta, alert }: Entry) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  await db.insert(auditLog).values({
    id: randomUUID(),
    actorId: actor.id,
    actorName: actor.name,
    action,
    targetId: target?.id ?? null,
    targetLabel: target?.label ?? null,
    meta: meta ?? null,
    ip,
  });

  if (!(alert ?? ALERT_ACTIONS.includes(action))) return;
  try {
    const owners = await db
      .select({ email: user.email, name: user.name })
      .from(user)
      .where(eq(user.role, "owner"));
    const locale = await getLocale();
    // Leading space only when there is a target: "X deleted Y." vs "X signed in."
    const details = {
      actor: actor.name,
      target: target ? ` ${target.label}` : "",
      ip: ip ?? "",
    };
    await Promise.all(
      owners.map(async (owner) =>
        sendEmail({
          to: owner.email,
          subject: await securityAlertSubject(locale),
          react: await SecurityAlertEmail({
            locale,
            name: owner.name,
            action,
            ...details,
          }),
        }),
      ),
    );
  } catch (error) {
    // The log entry is what matters; a failed email mustn't undo or block the action.
    console.error("[audit] alert email failed", error);
  }
}
