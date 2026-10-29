"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The header's pill. It measures itself: when the inline section links don't fit (long
 * labels in German or Russian, a narrow laptop) it sets `data-collapsed`, which hides
 * them and shows the menu button instead. Breakpoints alone can't know label lengths.
 */
export function HeaderBar({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  // Width the bar needed when it last overflowed; it expands again once it has that much.
  const needed = useRef(0);

  useLayoutEffect(() => {
    const el = bar.current;
    if (!el) return;
    const check = () => {
      if (!collapsed && el.scrollWidth > el.clientWidth + 1) {
        needed.current = el.scrollWidth;
        setCollapsed(true);
      } else if (collapsed && el.clientWidth >= needed.current) {
        setCollapsed(false);
      }
    };
    check();
    // The children too: the account links arrive after the session loads.
    const observer = new ResizeObserver(check);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [collapsed]);

  return (
    <div
      ref={bar}
      data-collapsed={collapsed || undefined}
      className={cn("group/bar", className)}
    >
      {children}
    </div>
  );
}
