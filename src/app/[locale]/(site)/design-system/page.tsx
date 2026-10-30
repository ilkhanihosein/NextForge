import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/ui";
import {
  ComponentPreview,
  ScaleSwatch,
  SemanticSwatch,
  paletteScales,
  semanticTokens,
  steps,
} from "@/features/design-system";
import { privatePage } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return privatePage((await getTranslations("designSystem"))("title"));
}

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("designSystem");

  return (
    <Container className="pt-16">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section className="grid gap-10" aria-labelledby="palette">
        <h2 id="palette" className="font-display text-2xl">
          {t("palette")}
        </h2>
        {paletteScales.map((scale) => (
          <div key={scale.name} className="rounded-xl p-6 glass">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl">{scale.label}</h3>
              <p className="font-mono text-xs text-muted-foreground" dir="ltr">
                {scale.anchor.hex} → {scale.name}-{scale.anchor.step}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
              {steps.map((step) => (
                <ScaleSwatch
                  key={step}
                  step={step}
                  variable={`--color-${scale.name}-${step}`}
                  anchor={step === scale.anchor.step}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-16" aria-labelledby="semantic">
        <h2 id="semantic" className="font-display text-2xl">
          {t("semantic")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("semanticHint")}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {semanticTokens.map((s) => (
            <SemanticSwatch key={s.token} {...s} />
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="type">
        <h2 id="type" className="font-display text-2xl">
          {t("typography")}
        </h2>
        <div className="mt-6 grid gap-6 rounded-xl p-8 glass">
          <p className="font-display text-6xl tracking-tight">Display · Fraunces</p>
          <p className="font-display text-3xl">Heading — The quick brown fox</p>
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            Body · Manrope. Comfortable reading measure, generous line height and calm
            contrast keep long texts easy on the eyes in both themes.
          </p>
          <p lang="fa" dir="rtl" className="font-display text-2xl">
            فارسی · وزیرمتن — زبان را با لذت یاد بگیرید
          </p>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="components">
        <h2 id="components" className="font-display text-2xl">
          {t("components")}
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ComponentPreview theme="light" />
          <ComponentPreview theme="dark" />
        </div>
      </section>
    </Container>
  );
}
