import { cn } from "@/lib/utils";
import type { FormFieldProps } from "./form-field.types";

export function FormField({
  label,
  error,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error != null && error !== "" ? (
        <p className="text-xs font-medium text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
