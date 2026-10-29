import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth";
import { privatePage } from "@/lib/seo/metadata";
import { AuthCard } from "../auth-card";

export async function generateMetadata() {
  return privatePage((await getTranslations("auth"))("signInTitle"));
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const t = await getTranslations("auth");
  return (
    <AuthCard
      eyebrow={t("welcomeBack")}
      title={t("signInTitle")}
      description={t("signInDescription")}
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
