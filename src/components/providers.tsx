"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ConfirmProvider } from "./ui/confirm";

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
      <DirectionProvider direction={dir}>
        <ConfirmProvider>{children}</ConfirmProvider>
      </DirectionProvider>
      <Toaster
        position={dir === "rtl" ? "bottom-left" : "bottom-right"}
        dir={dir}
        closeButton
      />
    </ThemeProvider>
  );
}
