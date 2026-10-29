"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({
  children,
  dir,
}: {
  children: ReactNode;
  dir: "ltr" | "rtl";
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position={dir === "rtl" ? "bottom-left" : "bottom-right"}
        dir={dir}
        closeButton
      />
    </ThemeProvider>
  );
}
