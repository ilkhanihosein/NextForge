"use client";

import { LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { localizedPath } from "@/i18n/paths";
import { cn } from "@/lib/utils";
import { authClient } from "../auth-client";
import { isAdminRole } from "../roles";

/**
 * Reads the session on the client, so pages that render it stay statically cacheable.
 */
export function UserMenu({ className }: { className?: string }) {
  const t = useTranslations("auth");
  const { data, isPending } = authClient.useSession();

  if (isPending)
    return (
      <span className={cn("h-10 w-24 animate-pulse rounded-full bg-muted", className)} />
    );

  if (!data) {
    return (
      <Link
        href="/login"
        className={buttonVariants({ variant: "glass", size: "sm", className })}
      >
        <LogIn aria-hidden />
        {t("signIn")}
      </Link>
    );
  }

  const admin = isAdminRole(data.user.role);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {admin ? (
        <Link href="/admin" className={buttonVariants({ variant: "glass", size: "sm" })}>
          <LayoutDashboard aria-hidden />
          <span className="max-sm:sr-only">{t("admin")}</span>
        </Link>
      ) : null}
      <Link
        href="/account"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label={t("account")}
      >
        <UserRound className="size-4" aria-hidden />
      </Link>
      <SignOutButton />
    </div>
  );
}

export function SignOutButton({ withLabel = false }: { withLabel?: boolean }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        window.location.assign(localizedPath("/", locale));
      }}
      className={buttonVariants({ variant: "ghost", size: withLabel ? "sm" : "icon" })}
      aria-label={t("signOut")}
    >
      <LogOut className="size-4" aria-hidden />
      {withLabel ? t("signOut") : null}
    </button>
  );
}
