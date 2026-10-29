# Design system

Tokens live in `src/styles/globals.css` in three layers:

1. **Primitives** (`@theme static`): palette scales such as `oat`, `mulberry`, `reverie`, `midnight` (50–950). Never used for meaning directly.
2. **Semantics** (`:root` / `.dark`): `--background`, `--foreground`, `--primary`, `--brand`, `--muted-foreground`, `--border`, `--glass*`, `--aurora-*`, …
3. **Utilities** (`@theme inline`): exposes semantics to Tailwind (`bg-primary`, `text-brand`, `border-border`, `shadow-glass`).

Components only use layers 2–3, so **re-branding = new primitive scales + semantic mapping**. `/design-system` renders everything live from CSS, in both themes side by side.

## Glass language

- `glass`: translucent surface + hairline border + inner highlight + soft shadow, with `backdrop-filter` blur/saturate.
- `glass-strong`: denser, for dialogs and overlays on busy content.
- `<Aurora />`: fixed, slowly drifting colour fields + film grain behind everything (pure CSS).
- Motion: `animate-rise` (fade + lift + unblur), `ease-luxe`. All motion respects `prefers-reduced-motion`.

## Themes

`next-themes` toggles `.dark` on `<html>`. A subtree can be forced with `.light` / `.dark` (the `dark:` variant respects it). Dark mode uses a cream primary on navy; mulberry becomes the accent ink (`--brand`).

## Typography

Display: Fraunces (variable, soft optical sizes). Body: Manrope. Persian: Vazirmatn, applied automatically via `:lang(fa)`.

## Contrast

Body text pairs are ≥ 7:1 in both themes (WCAG AAA). Check new pairs before shipping.
