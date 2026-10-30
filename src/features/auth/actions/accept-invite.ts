"use server";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { fail, fromZodError, type ActionResult } from "@/lib/action";
import { AFTER_LOGIN_PATH } from "../config";
import { acceptInviteSchema } from "../schemas";
import { auth } from "../services/auth";
import { acceptInvitation } from "../services/invitations";

export async function acceptInviteAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = acceptInviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { token, password } = parsed.data;
  const accepted = await acceptInvitation(token, password);
  if (!accepted) return fail("inviteInvalid");

  // Sign straight in; nextCookies() writes the session cookie from this action.
  await auth.api.signInEmail({
    body: { email: accepted.email, password },
    headers: await headers(),
  });
  // Redirect from the server: re-rendering this page would find the invite consumed.
  return redirect({ href: AFTER_LOGIN_PATH, locale: await getLocale() });
}
