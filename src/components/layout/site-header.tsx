import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu, NavLink } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

type NavItem = { href: string; label: string };
type Props = { nav?: NavItem[]; cta?: NavItem };

/**
 * Phones keep the logo, the one most useful link and a menu; tablets add language and
 * the call to action; desktops show everything inline. The menu holds whatever a
 * breakpoint hides, so nothing is ever out of reach.
 */
export function SiteHeader({ nav = [], cta }: Props) {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 pt-3 sm:pt-4">
      {/* Fades the page out behind the floating bar, so scrolled text never collides with it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] bg-linear-to-b from-background/85 via-background/50 to-transparent"
      />
      <Container>
        <div className="flex h-14 items-center gap-2 rounded-full ps-5 pe-2 glass-strong sm:h-16 sm:gap-3 sm:ps-6 sm:pe-2.5">
          <Link
            href="/"
            className="-my-1 py-2 font-display text-lg tracking-tight whitespace-nowrap sm:text-xl"
            aria-label={t("home")}
          >
            {siteConfig.shortName}
          </Link>
          {nav.length ? (
            <nav
              aria-label={t("mainNav")}
              className="ms-4 hidden items-center gap-0.5 xl:flex"
            >
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-sm whitespace-nowrap text-muted-foreground transition hover:bg-glass-strong hover:text-foreground"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          ) : null}
          <div className="ms-auto flex items-center gap-1.5">
            <ThemeToggle className="max-lg:hidden" />
            <LocaleSwitcher className="max-sm:hidden" />
            <UserMenu compact className="lg:hidden" />
            <UserMenu className="max-lg:hidden" />
            {cta ? (
              <a
                href={cta.href}
                className={buttonVariants({ size: "sm", className: "max-sm:hidden" })}
              >
                {cta.label}
              </a>
            ) : null}
            <MobileMenu
              nav={nav}
              cta={cta}
              // With section links the bar fits everything only from xl up.
              className={nav.length ? "xl:hidden" : "lg:hidden"}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
