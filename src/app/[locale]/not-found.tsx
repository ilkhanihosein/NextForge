import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="w-full max-w-lg animate-rise rounded-2xl p-10 text-center glass">
        <Compass className="mx-auto size-8 text-brand" aria-hidden />
        <p className="mt-6 text-xs tracking-[0.35em] text-brand uppercase">404</p>
        <h1 className="mt-3 font-display text-4xl">{t("title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("description")}</p>
        <Link href="/" className={buttonVariants({ className: "mt-8" })}>
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
