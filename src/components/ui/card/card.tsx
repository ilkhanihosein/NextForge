import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { CardProps } from "./card.types";

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-8",
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, padding = "md", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/70 bg-panel text-foreground shadow-soft",
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
