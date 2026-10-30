import { getTranslations } from "next-intl/server";
import { getDirection, siteConfig } from "@/config/site";
import { localizedPath } from "@/i18n/paths";
import { EmailLayout, EmailText } from "@/lib/email";
import { env } from "@/lib/env";
import type { AuditAction } from "../actions";

type Props = {
  locale: string;
  name: string;
  action: AuditAction;
  actor: string;
  target: string;
  ip: string;
};

export async function securityAlertSubject(locale: string) {
  const t = await getTranslations({
    locale: locale as "en",
    namespace: "emails.securityAlert",
  });
  return t("subject", { brand: siteConfig.name });
}

export async function SecurityAlertEmail({
  locale,
  name,
  action,
  actor,
  target,
  ip,
}: Props) {
  const t = await getTranslations({
    locale: locale as "en",
    namespace: "emails.securityAlert",
  });
  const ta = await getTranslations({
    locale: locale as "en",
    namespace: "admin.activity",
  });
  return (
    <EmailLayout
      lang={locale}
      dir={getDirection(locale)}
      brand={siteConfig.name}
      preview={t("preview")}
      heading={t("heading", { name })}
      action={{
        label: t("action"),
        href: `${env.NEXT_PUBLIC_APP_URL}${localizedPath("/admin/activity", locale)}`,
      }}
      footer={t("footer")}
    >
      <EmailText>{t("body", { what: ta(`actions.${action}`), actor, target })}</EmailText>
      {ip ? <EmailText>{t("ip", { ip })}</EmailText> : null}
    </EmailLayout>
  );
}
