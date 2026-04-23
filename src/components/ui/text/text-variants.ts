import type { TextVariant } from "./text.types";

export const textVariantClasses: Record<TextVariant, string> = {
  body: "text-sm leading-relaxed text-foreground",
  caption: "text-xs leading-normal text-muted-foreground",
  heading: "text-xl font-bold tracking-tight text-foreground md:text-2xl",
};
