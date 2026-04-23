import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonSize, ButtonVariant } from "./button-variants";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
