"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Shows the *computed* value of a CSS variable, so the docs can never drift from CSS. */
function useComputedColor(variable: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setValue(toHex(getComputedStyle(el).backgroundColor));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [variable]);
  return { ref, value };
}

function toHex(color: string) {
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || !color.startsWith("rgb")) return color;
  const [r, g, b, a] = m.map(Number);
  const hex = `#${[r, g, b]
    .map((v) =>
      Math.round(v ?? 0)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
  return a !== undefined && a < 1 ? `${hex} · ${Math.round(a * 100)}%` : hex;
}

export function ScaleSwatch({
  variable,
  step,
  anchor,
}: {
  variable: string;
  step: number;
  anchor?: boolean;
}) {
  const { ref, value } = useComputedColor(variable);
  return (
    <div className="grid gap-1.5">
      <div
        ref={ref}
        style={{ background: `var(${variable})` }}
        className={cn(
          "h-14 rounded-md border border-black/5 dark:border-white/10",
          anchor && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
        )}
      />
      <p className="text-xs font-medium">{step}</p>
      <p className="font-mono text-[10px] text-muted-foreground" dir="ltr">
        {value}
      </p>
    </div>
  );
}

export function SemanticSwatch({ token, pair }: { token: string; pair: string }) {
  const { ref, value } = useComputedColor(`--${token}`);
  return (
    <div className="overflow-hidden rounded-lg glass">
      <div
        ref={ref}
        style={{ background: `var(--${token})`, color: `var(--${pair})` }}
        className="flex h-20 items-end p-3 font-display text-lg"
      >
        Aa
      </div>
      <div className="p-3">
        <p className="text-sm font-medium">--{token}</p>
        <p className="font-mono text-xs text-muted-foreground" dir="ltr">
          {value}
        </p>
      </div>
    </div>
  );
}
