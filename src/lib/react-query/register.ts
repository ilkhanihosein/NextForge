/**
 * TanStack Query module augmentation — keeps `meta` typed project-wide.
 * Imported from `query-client.ts` so the program always loads it.
 */
export type AppReactQueryMeta = {
  /** Skip the global `QueryCache` / `MutationCache` error toast (handle in UI or stay silent). */
  suppressErrorToast?: boolean;
  /** Optional title for the global error toast when it is shown. */
  errorToastTitle?: string;
};

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: AppReactQueryMeta;
    mutationMeta: AppReactQueryMeta;
  }
}
