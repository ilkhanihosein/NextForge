"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme, theme } = useTheme();
  const { dictionary } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const options: ThemeOption[] = ["light", "dark", "system"];
  const activeTheme = (theme as ThemeOption) ?? "system";

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-panel/80 p-1 backdrop-blur">
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setTheme(item)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            mounted && activeTheme === item
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label={`${dictionary.common.switchTheme}: ${dictionary.theme[item]}`}
          title={
            mounted && item === "system" && resolvedTheme
              ? `${dictionary.theme.system} (${resolvedTheme})`
              : dictionary.theme[item]
          }
        >
          {dictionary.theme[item]}
        </button>
      ))}
    </div>
  );
};
