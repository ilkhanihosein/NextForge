import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter() {
  const t = useTranslations("common");
  return (
    <footer className="mt-24 pb-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-5 text-sm text-muted-foreground glass">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </p>
          <ThemeToggle className="sm:hidden" />
        </div>
      </Container>
    </footer>
  );
}
