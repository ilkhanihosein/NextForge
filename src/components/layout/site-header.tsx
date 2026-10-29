import { useTranslations } from "next-intl";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ nav = [] }: { nav?: { href: string; label: string }[] }) {
  const t = useTranslations("common");
  return (
    <header className="sticky top-0 z-40 pt-3 sm:pt-4">
      <Container>
        <div className="flex h-16 items-center gap-3 rounded-full ps-6 pe-2.5 glass">
          <Link
            href="/"
            className="font-display text-xl tracking-tight"
            aria-label={t("home")}
          >
            {siteConfig.shortName}
          </Link>
          {nav.length ? (
            <nav
              aria-label={t("mainNav")}
              className="ms-6 hidden items-center gap-1 md:flex"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition hover:bg-glass-strong hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div className="ms-auto flex items-center gap-1.5">
            <ThemeToggle className="max-sm:hidden" />
            <LocaleSwitcher />
            <UserMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
