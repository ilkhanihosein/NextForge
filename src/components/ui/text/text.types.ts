import type { HTMLAttributes, ReactNode } from "react";

export type TextVariant = "body" | "caption" | "heading";

export type TextProps = {
  variant?: TextVariant;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;
