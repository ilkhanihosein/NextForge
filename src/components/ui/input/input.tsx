import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { InputProps } from "./input.types";

const baseClassName =
  "flex w-full min-h-10 rounded-lg border bg-panel px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const normalBorder = "border-border";
const errorBorder = "border-error focus-visible:ring-error/35";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, disabled, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      className={cn(baseClassName, error ? errorBorder : normalBorder, className)}
      {...props}
    />
  );
});
