"use client";

import { useEffect, useRef } from "react";
import { ensureSessionCookiesFromStore } from "@/features/auth/session";

/**
 * If tokens exist in localStorage (e.g. after an upgrade) but HttpOnly cookies are missing,
 * mirror them once so Edge middleware can see the session on the next navigation.
 */
export function AuthSessionBootstrap() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void ensureSessionCookiesFromStore().catch(() => {
      /* ignore — user may hit /login or refresh */
    });
  }, []);

  return null;
}
