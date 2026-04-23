# Internationalization (i18n)

This template uses **App Router locale segments** and **typed dictionaries**—not `next-intl`.

## Configuration

- **`src/config/site.ts`**
  - `locales`: tuple of supported locale codes (default: `en`, `fa`).
  - `defaultLocale`: used for redirect from `/` and for middleware/proxy fallback.
  - `rtlLocales`: locales that receive `dir="rtl"` on the localized `<main>`.

## Routing

- **`src/app/page.tsx`:** `redirect(\`/${siteConfig.defaultLocale}\`)`.
- **`src/app/[locale]/layout.tsx`:** Validates `locale`, loads dictionary, sets `dir`, applies `locale-fa` class for Persian typography when `locale === "fa"`.
- **`src/proxy.ts`:** If the path does not start with a known locale segment, rewrites to `/${defaultLocale}${pathname}`.

## Dictionaries

- **`src/i18n/dictionaries/<locale>.ts`:** Plain objects with nested keys (mirror shape across locales for type safety).
- **`src/i18n/get-dictionary.ts`:** Maps `Locale` → dictionary object; exports `Dictionary` type from the English shape.
- **`src/i18n/get-direction.ts`:** Returns `"rtl"` or `"ltr"` from `rtlLocales`.

## Client access

- **`src/context/app-context.tsx`:** Provides `{ locale, dictionary }` to client trees under `AppProviders`.
- **`useAppContext()`** in client components for labels and branching (e.g. toast demo copy).

## Fonts (Persian)

- **Baloo Bhaijaan 2** is loaded in root `src/app/layout.tsx` as a CSS variable.
- **`.locale-fa`** in `globals.css` applies the Persian font stack.
- **`ToastProvider`** applies `locale-fa` and RTL classes for Sonner when `locale === "fa"` (toasts render in a portal).

## Adding a locale

1. Add code to `siteConfig.locales` and `generateStaticParams` in `[locale]/layout.tsx` will pick it up.
2. Add `src/i18n/dictionaries/<code>.ts` and register it in `get-dictionary.ts`.
3. If RTL, add the code to `rtlLocales` in `site.ts`.

## Related documents

| Topic          | Document                             |
| -------------- | ------------------------------------ |
| Overall layout | [architecture.md](./architecture.md) |
| Toasts + RTL   | [toast-system.md](./toast-system.md) |

**Core stack:** [Documentation index](./README.md) · [Architecture](./architecture.md) · [API layer](./api-layer.md) · [Auth](./auth-system.md)
