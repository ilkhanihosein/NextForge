import type { ReactNode } from "react";

export type FormFieldProps = {
  label: ReactNode;
  /** Shown when present; display only — no validation. */
  error?: ReactNode;
  /** Pass the same value as the control's `id`. */
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};
