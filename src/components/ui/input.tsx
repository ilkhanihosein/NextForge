import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const fieldBase = cn(
  "w-full rounded-md border border-border-strong bg-input px-4 text-sm text-foreground",
  "shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--foreground)_6%,transparent)] backdrop-blur-md",
  "transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70",
  "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-danger/15",
);

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-28 py-3 leading-relaxed", className)}
      {...props}
    />
  );
}
