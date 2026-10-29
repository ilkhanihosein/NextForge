import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ForgotPasswordForm } from "@/features/auth";
import { Link } from "@/i18n/navigation";
import { privatePage } from "@/lib/seo/metadata";
import { AuthCard } from "../auth-card";

export async function generateMetadata() {
  return privatePage((await getTranslations("auth"))("forgotTitle"));
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale as Locale);
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("forgotTitle")} description={t("forgotDescription")}>
      <ForgotPasswordForm />
      <Link
        href="/login"
        className="mt-6 block text-center text-sm text-brand hover:underline"
      >
        {t("backToLogin")}
      </Link>
    </AuthCard>
  );
}
