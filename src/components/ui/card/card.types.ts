import type { HTMLAttributes, ReactNode } from "react";

export type CardPadding = "none" | "sm" | "md" | "lg";

export type CardProps = {
  children: ReactNode;
  padding?: CardPadding;
} & HTMLAttributes<HTMLDivElement>;
