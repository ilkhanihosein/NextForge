import type { Locale } from "@/config/site";
import en from "@/i18n/dictionaries/en";
import fa from "@/i18n/dictionaries/fa";

const dictionaries = {
  en,
  fa,
} as const;

export type Dictionary = (typeof dictionaries)["en"];

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale];
};
