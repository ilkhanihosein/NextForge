import type { ReactNode } from "react";

// The real document shell is app/[locale]/layout.tsx; this exists for Next's root contract.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
