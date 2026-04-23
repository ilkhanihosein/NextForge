"use client";

import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  FolderTree,
  Globe,
  Languages,
  LayoutTemplate,
  RefreshCw,
  Store,
  SunMedium,
} from "lucide-react";
import { useAppContext } from "@/context/app-context";

const STACK_ORDER = [
  "appRouter",
  "i18n",
  "themes",
  "reactQuery",
  "axios",
  "errors",
  "features",
  "clientState",
  "quality",
] as const;

type StackKey = (typeof STACK_ORDER)[number];

const icons: Record<StackKey, LucideIcon> = {
  appRouter: LayoutTemplate,
  i18n: Languages,
  themes: SunMedium,
  reactQuery: RefreshCw,
  axios: Globe,
  errors: Bell,
  features: FolderTree,
  clientState: Store,
  quality: BadgeCheck,
};

type StarterStackCardsProps = {
  /** Full grid on home; compact horizontal strip on detail pages. */
  variant?: "default" | "compact";
  /** When false, parent renders the main stack heading (e.g. as `h2`) for a single glance layout. */
  showHeading?: boolean;
};

export function StarterStackCards({
  variant = "default",
  showHeading = true,
}: StarterStackCardsProps) {
  const { dictionary } = useAppContext();
  const cards = dictionary.home.stackCards;
  const title = dictionary.home.stackTitle;

  if (variant === "compact") {
    return (
      <div className="mt-10 border-t border-border/60 pt-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STACK_ORDER.map((key) => {
            const Icon = icons[key];
            const item = cards[key];
            return (
              <div
                key={key}
                className="flex min-w-[140px] shrink-0 flex-col rounded-xl border border-border/70 bg-panel/60 p-3 text-center shadow-sm"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-2 text-xs font-semibold leading-tight text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={showHeading ? "mt-12" : ""}>
      {showHeading ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      ) : null}
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-4" : "mt-0"}`}
      >
        {STACK_ORDER.map((key) => {
          const Icon = icons[key];
          const item = cards[key];
          return (
            <div
              key={key}
              className="group flex flex-col rounded-2xl border border-border/70 bg-gradient-to-b from-panel/90 to-panel/40 p-4 shadow-soft transition hover:border-brand/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand transition group-hover:bg-brand/20">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
