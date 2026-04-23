"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";

type AppContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const AppContext = createContext<AppContextValue | null>(null);

type AppContextProviderProps = AppContextValue & {
  children: React.ReactNode;
};

export const AppContextProvider = ({
  children,
  locale,
  dictionary,
}: AppContextProviderProps) => {
  return (
    <AppContext.Provider value={{ locale, dictionary }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};
