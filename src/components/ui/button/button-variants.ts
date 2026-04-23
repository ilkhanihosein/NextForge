import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "border border-border bg-panel text-foreground hover:border-brand/40 hover:bg-accent-soft/60",
  ghost:
    "border border-transparent bg-transparent text-foreground hover:bg-accent-soft/80 dark:hover:bg-accent-soft/40",
  danger: "border border-transparent bg-error text-error-foreground hover:bg-error/90",
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 text-xs",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-11 px-5 text-base",
};

export function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(base, buttonVariantClasses[variant], buttonSizeClasses[size], className);
}
