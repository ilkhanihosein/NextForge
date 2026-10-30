import type { Locale } from "next-intl";
import {
  ArrowRight,
  Database,
  Globe2,
  HardDrive,
  Mail,
  Palette,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor("/", locale) };
}

const features = [
  { key: "i18n", icon: Globe2 },
  { key: "auth", icon: ShieldCheck },
  { key: "db", icon: Database },
  { key: "email", icon: Mail },
  { key: "storage", icon: HardDrive },
  { key: "design", icon: Palette },
] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");

  return (
    <Container className="pt-20 md:pt-28">
      <section className="mx-auto max-w-3xl animate-rise text-center">
        <p className="text-xs font-semibold tracking-[0.35em] text-brand uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/design-system" className={buttonVariants({ size: "lg" })}>
            {t("primaryCta")}
            <ArrowRight className="rtl:rotate-180" aria-hidden />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ size: "lg", variant: "glass" })}
          >
            {t("secondaryCta")}
          </Link>
        </div>
      </section>
      <section className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ key, icon: Icon }, i) => (
          <article
            key={key}
            className="animate-rise rounded-xl p-7 glass"
            style={{ animationDelay: `${120 + i * 70}ms` }}
          >
            <Icon className="size-5 text-brand" aria-hidden />
            <h2 className="mt-5 font-display text-xl">{t(`features.${key}.title`)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`features.${key}.body`)}
            </p>
          </article>
        ))}
      </section>
    </Container>
  );
}
