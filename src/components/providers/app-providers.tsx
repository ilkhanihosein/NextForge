"use client";

import { AppContextProvider } from "@/context/app-context";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import { AuthSessionBootstrap } from "@/features/auth/ui/auth-session-bootstrap";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

type AppProvidersProps = {
  children: React.ReactNode;
  locale: Locale;
  dictionary: Dictionary;
};

export const AppProviders = ({ children, locale, dictionary }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AppContextProvider locale={locale} dictionary={dictionary}>
          <AuthSessionBootstrap />
          {children}
          <ToastProvider />
        </AppContextProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};
