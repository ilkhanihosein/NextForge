import { ApiError } from "@/lib/api";

/** Prefer server message; for validation errors, first field message is usually best for a short toast. */
export const errorToastDescription = (error: unknown): string => {
  if (error instanceof ApiError) {
    const fields = error.fieldErrors;
    if (fields) {
      for (const messages of Object.values(fields)) {
        const first = messages?.[0];
        if (first) return first;
      }
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong";
};
