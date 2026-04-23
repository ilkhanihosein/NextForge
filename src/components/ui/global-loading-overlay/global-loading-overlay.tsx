"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

export function GlobalLoadingOverlay() {
  const isGlobalLoading = useUiStore((s) => s.isGlobalLoading);

  useEffect(() => {
    if (!isGlobalLoading) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isGlobalLoading]);

  return (
    <div
      aria-hidden={!isGlobalLoading}
      aria-busy={isGlobalLoading}
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center bg-background/75 backdrop-blur-[3px] transition-opacity duration-300 ease-out motion-reduce:transition-none",
        isGlobalLoading
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <div
        className={cn(
          "rounded-2xl border border-border/80 bg-panel/95 p-8 shadow-soft transition-opacity duration-300 ease-out motion-reduce:transition-none",
          isGlobalLoading ? "opacity-100" : "opacity-0",
        )}
      >
        <Loader2
          className="size-10 animate-spin text-primary motion-reduce:animate-none"
          aria-hidden
        />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
