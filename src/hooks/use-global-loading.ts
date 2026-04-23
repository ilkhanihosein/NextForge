"use client";

import { useCallback } from "react";
import { useUiStore } from "@/store/ui-store";

export function useGlobalLoading() {
  const isLoading = useUiStore((s) => s.isGlobalLoading);
  const setGlobalLoading = useUiStore((s) => s.setGlobalLoading);

  const startLoading = useCallback(() => {
    setGlobalLoading(true);
  }, [setGlobalLoading]);

  const stopLoading = useCallback(() => {
    setGlobalLoading(false);
  }, [setGlobalLoading]);

  return { isLoading, startLoading, stopLoading };
}
