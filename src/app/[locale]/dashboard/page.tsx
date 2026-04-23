import { notFound } from "next/navigation";
import { RequireRole } from "@/features/auth";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }
  const dictionary = getDictionary(locale as Locale);
  const a = dictionary.auth;

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <RequireRole role="admin">
        <article className="rounded-2xl border border-border/70 bg-panel p-6 shadow-soft">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {a.dashboardTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {a.dashboardIntro}
          </p>
        </article>
      </RequireRole>
    </section>
  );
}
