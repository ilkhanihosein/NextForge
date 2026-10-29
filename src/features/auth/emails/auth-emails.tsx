import { getTranslations } from "next-intl/server";
import { siteConfig, getDirection } from "@/config/site";
import { EmailLayout, EmailText } from "@/lib/email";

type Props = { locale: string; name: string; url: string };

export async function InvitationEmail({ locale, name, url }: Props) {
  const t = await getTranslations({
    locale: locale as "en",
    namespace: "emails.invitation",
  });
  return (
    <EmailLayout
      lang={locale}
      dir={getDirection(locale)}
      brand={siteConfig.name}
      preview={t("preview", { brand: siteConfig.name })}
      heading={t("heading", { name })}
      action={{ label: t("action"), href: url }}
      footer={t("footer")}
    >
      <EmailText>{t("body", { brand: siteConfig.name })}</EmailText>
    </EmailLayout>
  );
}

export async function ResetPasswordEmail({ locale, name, url }: Props) {
  const t = await getTranslations({
    locale: locale as "en",
    namespace: "emails.resetPassword",
  });
  return (
    <EmailLayout
      lang={locale}
      dir={getDirection(locale)}
      brand={siteConfig.name}
      preview={t("preview")}
      heading={t("heading", { name })}
      action={{ label: t("action"), href: url }}
      footer={t("footer")}
    >
      <EmailText>{t("body")}</EmailText>
    </EmailLayout>
  );
}
