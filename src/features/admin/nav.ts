import { LayoutDashboard, ShieldCheck, Users, type LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  /** Key under messages `admin.nav`. */
  label: "dashboard" | "users" | "activity";
  icon: LucideIcon;
  exact?: boolean;
  /** Shown to owners only (the page itself checks too). */
  ownerOnly?: boolean;
};

/** Register a feature's admin screen here to get it into the sidebar. */
export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "users", icon: Users },
  { href: "/admin/activity", label: "activity", icon: ShieldCheck, ownerOnly: true },
];
