import type { z } from "zod";

/**
 * Uniform return shape for Server Actions so forms can render field errors and
 * messages without try/catch at every call site.
 */
export type ActionResult<T = void> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export const ok = <T>(data: T, message?: string): ActionResult<T> => ({
  ok: true,
  data,
  message,
});

export const fail = (
  error: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionResult<never> => ({ ok: false, error, fieldErrors });

export function fromZodError(error: z.ZodError, message = "validation") {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fail(message, fieldErrors);
}
