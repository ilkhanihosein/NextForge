import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--primary)_70%,transparent)] hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
  glass: "glass text-foreground hover:bg-glass-strong",
  outline: "border border-border-strong bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  danger: "bg-danger text-white hover:brightness-110 dark:text-midnight-950",
  link: "h-auto rounded-none bg-transparent p-0 text-brand underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-13 gap-2.5 px-7 text-base",
  icon: "size-10",
  "icon-sm": "size-8",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

/** Shared with links: `<Link className={buttonVariants({ variant: "glass" })}>`. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap",
    "transition-[background-color,box-shadow,filter,transform] duration-300 ease-luxe active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    variant !== "link" && sizes[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
