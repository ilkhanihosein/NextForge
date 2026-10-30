"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

const subscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common.theme");
  const { theme, setTheme } = useTheme();
  // The theme is only known after hydration; render a neutral state until then.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div
      role="radiogroup"
      aria-label={t("label")}
      className={cn("flex items-center gap-0.5 rounded-full p-1 glass", className)}
    >
      {options.map(({ value, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(value)}
            title={t(value)}
            onClick={() => setTheme(value)}
            className={cn(
              "grid size-8 place-items-center rounded-full text-muted-foreground transition duration-300",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
