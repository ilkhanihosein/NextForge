"use client";

import { LayoutDashboard, LogIn, LogOut, UserRound, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { localizedPath } from "@/i18n/paths";
import { cn } from "@/lib/utils";
import { authClient } from "../auth-client";
import { isAdminRole } from "../roles";

/**
 * Reads the session on the client, so pages that render it stay statically cacheable.
 * `compact` keeps only the one link that matters most (the account, or signing in), for
 * headers too narrow for the rest; the rest then lives in <UserMenuList>. A project with
 * a members' area makes that its primary link instead.
 */
export function UserMenu({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations("auth");
  const { data, isPending } = authClient.useSession();

  if (isPending)
    return (
      <span
        className={cn(
          "h-10 animate-pulse rounded-full bg-muted",
          compact ? "w-10 sm:w-24" : "w-24",
          className,
        )}
      />
    );

  if (!data) {
    return (
      <Link
        href="/login"
        className={buttonVariants({
          variant: "glass",
          size: "sm",
          className: cn("max-sm:size-10 max-sm:px-0", className),
        })}
        aria-label={t("signIn")}
      >
        <LogIn aria-hidden />
        <span className="max-sm:hidden">{t("signIn")}</span>
      </Link>
    );
  }

  const primaryLink = (
    <Link
      href="/account"
      className={buttonVariants({
        variant: "glass",
        size: "sm",
        className: cn(compact && "max-sm:size-10 max-sm:px-0", compact && className),
      })}
      aria-label={t("account")}
    >
      <UserRound aria-hidden />
      <span className={cn(compact && "max-sm:hidden")}>{t("account")}</span>
    </Link>
  );
  if (compact) return primaryLink;

  const admin = isAdminRole(data.user.role);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {admin ? (
        <Link
          href="/admin"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          aria-label={t("admin")}
          title={t("admin")}
        >
          <LayoutDashboard className="size-4" aria-hidden />
        </Link>
      ) : null}
      {primaryLink}
      <SignOutButton />
    </div>
  );
}

/** The account links as a labelled list, for the mobile menu. */
export function UserMenuList({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("auth");
  const { data, isPending } = authClient.useSession();

  if (isPending) return <div className="h-12 animate-pulse rounded-xl bg-muted" />;

  if (!data)
    return (
      <ul className="grid gap-1">
        <MenuLink href="/login" icon={LogIn} label={t("signIn")} onClick={onNavigate} />
      </ul>
    );

  return (
    <div className="grid gap-1">
      <div className="px-3 pt-1 pb-2">
        <p className="truncate font-medium">{data.user.name}</p>
        <p className="truncate text-sm text-muted-foreground">{data.user.email}</p>
      </div>
      <ul className="grid gap-1">
        {isAdminRole(data.user.role) ? (
          <MenuLink
            href="/admin"
            icon={LayoutDashboard}
            label={t("admin")}
            onClick={onNavigate}
          />
        ) : null}
        <MenuLink
          href="/account"
          icon={UserRound}
          label={t("account")}
          onClick={onNavigate}
        />
        <li>
          <SignOutButton withLabel className={menuRowClasses} />
        </li>
      </ul>
    </div>
  );
}

const menuRowClasses =
  "flex h-12 w-full items-center justify-start gap-3 rounded-xl px-3 text-base font-normal text-foreground transition hover:bg-glass";

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link href={href} onClick={onClick} className={menuRowClasses}>
        <Icon className="size-4.5 text-muted-foreground" aria-hidden />
        {label}
      </Link>
    </li>
  );
}

export function SignOutButton({
  withLabel = false,
  className,
}: {
  withLabel?: boolean;
  className?: string;
}) {
  const t = useTranslations("auth");
  const locale = useLocale();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        window.location.assign(localizedPath("/", locale));
      }}
      className={
        className ?? buttonVariants({ variant: "ghost", size: withLabel ? "sm" : "icon" })
      }
      aria-label={withLabel ? undefined : t("signOut")}
      title={withLabel ? undefined : t("signOut")}
    >
      <LogOut
        className={cn("size-4", className && "size-4.5 text-muted-foreground")}
        aria-hidden
      />
      {withLabel ? t("signOut") : null}
    </button>
  );
}
