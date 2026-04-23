"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGlobalLoading } from "@/hooks/use-global-loading";

const AUTO_HIDE_MS = 3000;

/**
 * Renders nothing in production. Development-only control for the global loading overlay.
 */
export function GlobalLoadingDevToggle() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <GlobalLoadingDevToggleInner />;
}

function GlobalLoadingDevToggleInner() {
  const { isLoading, startLoading, stopLoading } = useGlobalLoading();
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const showOverlayForFewSeconds = () => {
    clearHideTimer();
    startLoading();
    hideTimerRef.current = setTimeout(() => {
      stopLoading();
      hideTimerRef.current = null;
    }, AUTO_HIDE_MS);
  };

  const toggleManual = () => {
    clearHideTimer();
    if (isLoading) {
      stopLoading();
    } else {
      startLoading();
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-amber-500/50 bg-amber-500/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
        Development only
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Global overlay: UI stays mounted underneath. Not tied to React Query.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={showOverlayForFewSeconds}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-panel px-3 py-2 text-xs font-semibold text-foreground transition hover:border-brand/50 hover:bg-muted"
        >
          Show overlay (~3s, then auto-hide)
        </button>
        <button
          type="button"
          onClick={toggleManual}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-panel px-3 py-2 text-xs font-semibold text-foreground transition hover:border-brand/50 hover:bg-muted"
        >
          {isLoading ? "Stop overlay (manual)" : "Start overlay (manual)"}
        </button>
      </div>
    </div>
  );
}
