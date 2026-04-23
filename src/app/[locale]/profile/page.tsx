import { notFound } from "next/navigation";
import { AuthGate, AuthProfileEmail } from "@/features/auth";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const a = dictionary.auth;

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <AuthGate locale={typedLocale}>
        <article className="rounded-2xl border border-border/70 bg-panel p-6 shadow-soft">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {a.profileTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {a.profileIntro}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{a.profileEmail}:</span>{" "}
            <AuthProfileEmail />
          </p>
        </article>
      </AuthGate>
    </section>
  );
}
