"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { UserMenuList } from "@/features/auth";
import { cn } from "@/lib/utils";
import { LocaleList } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  nav: { href: string; label: string }[];
  cta?: { href: string; label: string };
  className?: string;
};

/**
 * Everything the header can't fit on phones and tablets, in a panel that drops over it.
 * A native modal <dialog>: focus trap, Esc and the top layer come from the browser.
 */
export function MobileMenu({ nav, cta, className }: Props) {
  const t = useTranslations("common");
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={t("openMenu")}
        aria-haspopup="dialog"
        className={buttonVariants({ variant: "ghost", size: "icon", className })}
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <dialog
        ref={dialog}
        aria-label={t("menu")}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-0 h-auto max-h-dvh w-full max-w-none bg-transparent p-3 text-foreground backdrop:bg-midnight-950/45 backdrop:backdrop-blur-sm open:animate-fade sm:p-4"
      >
        <div className="ms-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto overscroll-contain rounded-3xl p-2 glass-strong sm:max-w-sm">
          <div className="flex h-12 items-center justify-between ps-3">
            <span className="font-display text-lg tracking-tight">
              {siteConfig.shortName}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={t("closeMenu")}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          {nav.length ? (
            <nav aria-label={t("mainNav")} className="mt-1 border-b pb-2">
              <ul className="grid gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      onClick={close}
                      className="flex h-12 items-center rounded-xl px-3 text-base transition hover:bg-glass"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className={cn("pb-2", nav.length ? "mt-2 border-b" : "mt-1 border-b")}>
            <UserMenuList onNavigate={close} />
          </div>

          <div className="border-b px-1 py-3">
            <p className="mb-2 px-2 text-xs text-muted-foreground">{t("language")}</p>
            <LocaleList onNavigate={close} />
          </div>

          <div className="flex items-center justify-between gap-3 px-3 py-3">
            <span className="text-sm text-muted-foreground">{t("theme.label")}</span>
            <ThemeToggle />
          </div>

          {cta ? (
            <a
              href={cta.href}
              onClick={close}
              className={buttonVariants({ className: "mb-1 w-full" })}
            >
              {cta.label}
            </a>
          ) : null}
        </div>
      </dialog>
    </>
  );
}

/** Section anchors ("#about") stay plain links; routes go through the locale-aware Link. */
export function NavLink({
  href,
  ...props
}: { href: string } & Omit<React.ComponentProps<"a">, "href">) {
  return href.startsWith("#") ? (
    <a href={href} {...props} />
  ) : (
    <Link href={href} {...props} />
  );
}
