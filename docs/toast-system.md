# Toast system

## Libraries

- **`sonner`** — toaster host and queue.
- **`framer-motion`** — micro-animations on toast content (icon + description).
- **`lucide-react`** — icons per variant.

## Files

| File                                          | Role                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/components/providers/toast-provider.tsx` | Renders `<Toaster />`, `dir` by locale, applies `locale-fa` + `toast-rtl` classes to toast root.              |
| `src/components/ui/toast-content.tsx`         | Branded card layout, close button, animated icon block.                                                       |
| `src/lib/toast.tsx`                           | **`appToast`**: `success`, `error`, `warning`, `info`, `loading` — each uses `toast.custom` + dismiss wiring. |

## Styling and RTL

- Toast chrome uses **`.toast-card`** and variant modifiers in **`globals.css`** (semantic colors for success/error/info/warning/loading).
- **`.toast-rtl`** adjusts `direction`, `text-align`, title padding, and close button position for Persian.
- Default Sonner **`closeButton`** is disabled; a **custom close** control dismisses via `toast.dismiss(id)`.

## Usage

```tsx
"use client";

import { appToast } from "@/lib/toast";

appToast.success({ title: "Saved", description: "Your changes are stored." });
```

## Related documents

| Topic                      | Document                                                       |
| -------------------------- | -------------------------------------------------------------- |
| i18n + RTL                 | [internationalization.md](./internationalization.md)           |
| Theme tokens used by cards | [theming-and-design-tokens.md](./theming-and-design-tokens.md) |
