"use client";

import { Toaster } from "sonner";
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";

export const ToastProvider = () => {
  const { locale } = useAppContext();

  return (
    <Toaster
      position="top-right"
      dir={locale === "fa" ? "rtl" : "ltr"}
      richColors
      expand
      closeButton={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "group relative w-full border-0 bg-transparent p-0 shadow-none",
            locale === "fa" && "locale-fa",
            locale === "fa" && "toast-rtl",
          ),
          title: "text-sm font-semibold",
          description: "mt-1 text-xs leading-6 text-muted-foreground",
          actionButton:
            "inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90",
          cancelButton:
            "inline-flex items-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-brand",
        },
      }}
    />
  );
};
