import "server-only";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type SendEmailInput = { to: string; subject: string; react: ReactElement };

/**
 * Sends through Resend (free tier: 3,000/month). Without RESEND_API_KEY the email is
 * printed to the server console, so local onboarding works with zero setup.
 */
export async function sendEmail({ to, subject, react }: SendEmailInput) {
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ]);

  if (!resend) {
    console.info(`\n✉️  [email:dev] to=${to}\nsubject: ${subject}\n${text}\n`);
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
  if (error) {
    console.error("[email] send failed", error);
    throw new Error("Email could not be sent");
  }
}
