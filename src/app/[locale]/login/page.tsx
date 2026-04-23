import { notFound } from "next/navigation";
import { LoginForm } from "@/features/auth";
import { siteConfig, type Locale } from "@/config/site";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;
  const { from } = await searchParams;
  const prefix = `/${typedLocale}`;
  const redirectTo =
    typeof from === "string" && from.startsWith(`${prefix}/`) ? from : undefined;

  return (
    <section className="mx-auto max-w-lg px-4 py-12">
      <LoginForm locale={typedLocale} redirectTo={redirectTo} />
    </section>
  );
}
