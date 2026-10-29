import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function SiteLayout({ children, params }: Props) {
  // Every layout/page using next-intl sets the locale so the route can render statically.
  setRequestLocale((await params).locale as Locale);
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
