"use client";

import { useTranslations } from "next-intl";
import { SignOutButton } from "@/features/auth";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { adminNav } from "../nav";

export function AdminSidebar({ userName }: { userName: string }) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <aside className="relative flex flex-col gap-1 rounded-xl p-1.5 glass max-lg:[scrollbar-width:none] max-lg:flex-row max-lg:overflow-x-auto lg:sticky lg:top-28 lg:min-h-[calc(100dvh-10rem)] lg:p-3 [&::-webkit-scrollbar]:hidden">
      <nav aria-label={t("label")} className="flex gap-1 max-lg:min-w-full lg:flex-col">
        {adminNav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm whitespace-nowrap text-muted-foreground transition max-lg:flex-1 max-lg:justify-center max-lg:px-3",
                "hover:bg-glass-strong hover:text-foreground",
                active && "bg-glass-strong text-foreground shadow-glass",
              )}
            >
              <Icon className={cn("size-4", active && "text-brand")} aria-hidden />
              {t(label)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden items-center justify-between gap-2 border-t px-2 pt-3 lg:flex">
        <span className="truncate text-sm text-muted-foreground">{userName}</span>
        <SignOutButton />
      </div>
    </aside>
  );
}
