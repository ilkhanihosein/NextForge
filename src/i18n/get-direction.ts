import { rtlLocales, type Locale } from "@/config/site";

export const getDirection = (locale: Locale) =>
  rtlLocales.includes(locale) ? "rtl" : "ltr";
