import { getTranslations } from "next-intl/server";
import { FormMessage } from "@/components/ui";
import { AcceptInviteForm } from "@/features/auth";
import { findPendingInvitation } from "@/features/auth/server";
import { privatePage } from "@/lib/seo/metadata";
import { AuthCard } from "../auth-card";

export async function generateMetadata() {
  return privatePage((await getTranslations("auth"))("inviteTitle"));
}

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const t = await getTranslations("auth");
  const invite = token ? await findPendingInvitation(token) : null;

  if (!token || !invite) {
    return (
      <AuthCard title={t("inviteTitle")}>
        <FormMessage tone="error">{t("errors.inviteInvalid")}</FormMessage>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow={t("inviteEyebrow")}
      title={t("inviteHello", { name: invite.name })}
      description={t("inviteDescription", { email: invite.email })}
    >
      <AcceptInviteForm token={token} email={invite.email} />
    </AuthCard>
  );
}
