import type { InputHTMLAttributes } from "react";

export type InputProps = {
  /** Visual error state only; no validation logic. */
  error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
