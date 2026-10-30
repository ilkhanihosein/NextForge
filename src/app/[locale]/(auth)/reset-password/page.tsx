import { getTranslations } from "next-intl/server";
import { FormMessage } from "@/components/ui";
import { ResetPasswordForm } from "@/features/auth";
import { Link } from "@/i18n/navigation";
import { privatePage } from "@/lib/seo/metadata";
import { AuthCard } from "../auth-card";

export async function generateMetadata() {
  return privatePage((await getTranslations("auth"))("resetTitle"));
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("resetTitle")} description={t("resetDescription")}>
      {token && !error ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="grid gap-5">
          <FormMessage tone="error">{t("errors.resetInvalid")}</FormMessage>
          <Link
            href="/forgot-password"
            className="text-center text-sm text-brand hover:underline"
          >
            {t("requestNewLink")}
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
