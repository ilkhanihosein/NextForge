"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

export function AuthProfileEmail() {
  const { user } = useAuth();
  return <span className="text-foreground">{user?.email ?? "—"}</span>;
}
