import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label + control + hint/error, with the ids wired for screen readers. */
export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Props to spread on the control inside a Field. */
export const fieldAria = (id: string, error?: string) => ({
  id,
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : `${id}-hint`,
});
