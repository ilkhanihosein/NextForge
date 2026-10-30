import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function AuthLayout({ children, params }: Props) {
  setRequestLocale((await params).locale as Locale);
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between p-5 sm:p-8">
        <Link href="/" className="font-display text-xl tracking-tight">
          {siteConfig.shortName}
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </header>
      <main id="main" className="grid flex-1 place-items-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
