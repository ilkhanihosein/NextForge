import { cn } from "@/lib/utils";
import { textVariantClasses } from "./text-variants";
import type { TextProps } from "./text.types";

export function Text({ variant = "body", className, children, ...props }: TextProps) {
  const classes = cn(textVariantClasses[variant], className);

  if (variant === "heading") {
    return (
      <h2 className={classes} {...props}>
        {children}
      </h2>
    );
  }

  if (variant === "caption") {
    return (
      <span className={classes} {...props}>
        {children}
      </span>
    );
  }

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
}
