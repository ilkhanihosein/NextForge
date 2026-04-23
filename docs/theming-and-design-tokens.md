# Theming and design tokens

## Stack

- **Tailwind CSS v4** with `@import "tailwindcss"` and **`@theme inline`** in `src/app/globals.css`.
- **`next-themes`** for `class`-based light / dark / system preference (`src/components/providers/theme-provider.tsx`).
- Root **`layout.tsx`** sets `suppressHydrationWarning` on `<html>` to avoid hydration mismatches when the theme class is applied client-side.

## Token model

Design tokens are **CSS variables** on `:root` and `.dark`:

- **Surfaces:** `--background`, `--foreground`, `--panel`, `--border`, `--muted-foreground`, `--accent-soft`, `--shadow-soft`.
- **Brand / primary:** `--primary`, `--primary-foreground`, `--brand`.
- **Semantic (buttons, badges, toasts):** `--success`, `--success-foreground`, `--error`, `--error-foreground`, `--warning`, `--warning-foreground`, `--info`, `--info-foreground`.

Tailwind maps them under `@theme inline` as `--color-*` so utilities like `bg-panel`, `text-muted-foreground`, `border-border` resolve correctly.

## Semantic UI classes

**`globals.css`** defines reusable patterns:

- **`.btn-semantic`**, **`.btn-semantic--success|error|info|warning`** — demo buttons in `toast-showcase.tsx` use these for consistent state colors.

## Toast-specific surfaces

Toast cards use **`.toast-card--*`** variants with light and **`.dark .toast-card--*`** overrides for gradient backgrounds and borders that read well in both modes.

## Related documents

| Topic        | Document                             |
| ------------ | ------------------------------------ |
| Architecture | [architecture.md](./architecture.md) |
| Toasts       | [toast-system.md](./toast-system.md) |
