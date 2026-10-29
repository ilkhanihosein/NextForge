# Design system

Tokens live in `src/styles/globals.css` in three layers:

1. **Primitives** (`@theme static`): palette scales such as `oat`, `mulberry`, `reverie`, `midnight` (50–950). Never used for meaning directly.
2. **Semantics** (`:root` / `.dark`): `--background`, `--foreground`, `--primary`, `--brand`, `--muted-foreground`, `--border`, `--glass*`, `--aurora-*`, …
3. **Utilities** (`@theme inline`): exposes semantics to Tailwind (`bg-primary`, `text-brand`, `border-border`, `shadow-glass`).

Components only use layers 2–3, so **re-branding = new primitive scales + semantic mapping**. `/design-system` renders everything live from CSS, in both themes side by side.

## Glass language

- `glass`: translucent surface + hairline border + inner highlight + soft shadow, with `backdrop-filter` blur/saturate.
- `glass-strong`: denser, for the header, dialogs, menus and dropdowns over busy content.
- `<Aurora />`: fixed, slowly drifting colour fields + film grain behind everything (pure CSS).
- Motion: `animate-rise` (fade + lift + unblur), `ease-luxe`. All motion respects `prefers-reduced-motion`.

## Themes

`next-themes` toggles `.dark` on `<html>`. A subtree can be forced with `.light` / `.dark` (the `dark:` variant respects it). Dark mode uses a cream primary on navy; mulberry becomes the accent ink (`--brand`).

## Typography

Display: Fraunces (variable, soft optical sizes). Body: Manrope. Other scripts get their own faces through `:lang(…)` (Persian Vazirmatn, Arabic IBM Plex Sans Arabic + Amiri, Russian Playfair Display headings); see [i18n](i18n.md).

## Components (`src/components/ui`)

| Component                                                              | Notes                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `buttonVariants`                                             | Variants `primary`, `secondary`, `glass`, `outline`, `ghost`, `danger`, `link`; sizes `sm`, `md`, `lg`, `icon`, `icon-sm`. `buttonVariants()` styles links the same way.                                                                                                                                                                                                                                          |
| `Input`, `Textarea`, `Field`, `fieldAria`                              | `Field` wires label, hint and error ids for screen readers.                                                                                                                                                                                                                                                                                                                                                       |
| `Select`                                                               | Built on [Base UI](https://base-ui.com)'s headless Select: keyboard (arrows, Home/End, type-ahead, Esc), screen-reader semantics, collision-aware placement, large touch rows, a hidden input so `name` works in plain forms and server actions. Options: `{ value, label, description?, icon?, disabled? }`. Opens inside a modal `<dialog>` when it's in one; Esc closes only the list. `size="sm"` for tables. |
| `Dialog`                                                               | Native `<dialog>`: focus trap, Esc and the top layer come from the browser.                                                                                                                                                                                                                                                                                                                                       |
| `useConfirm()`                                                         | `if (await confirm({ title, description, confirmLabel, tone }))`. One app-wide dialog. The button says the action ("Delete user"), never "OK". `tone: "danger"` (default) for anything hard to undo. Replaces `window.confirm`.                                                                                                                                                                                   |
| `useConfirmWithPassword()`                                             | Same dialog plus a password field; resolves to the typed password or `null`. Pass the password to the server action, which checks it (`verifyOwnPassword`).                                                                                                                                                                                                                                                       |
| `Badge`, `Card`, `EmptyState`, `PageHeader`, `Skeleton`, `FormMessage` | Small building blocks.                                                                                                                                                                                                                                                                                                                                                                                            |

Layout (`src/components/layout`):

- **`SiteHeader`** + **`HeaderBar`**: phones show the logo, one primary link and a menu button; tablets add language and the call to action; desktops show everything. `HeaderBar` measures itself and, when the section links don't fit (long German or Russian labels, narrow laptops), sets `data-collapsed`, which moves them into the menu.
- **`MobileMenu`**: native modal dialog with section links, account links (`UserMenuList`), sign-out, the language grid and the theme switch. Whatever a breakpoint hides from the bar is in here, so nothing is ever out of reach.
- **`LocaleSwitcher`** / **`LocaleList`**, **`ThemeToggle`**, **`Aurora`**, **`Container`**.

## Phone & tablet rules

Checked at 360, 390, 768, 1024 and 1280 px, in LTR and RTL:

- `html, body { overflow-x: clip }` is a safety net: decorative glows past the edge must never let phones pan sideways or zoom the page out. It has to be on **both**: on `body` alone the value is handed to the viewport and doesn't clip.
- A scroll container (`overflow-x-auto`) must also be `relative`. Otherwise absolutely positioned children inside it (Tailwind's `sr-only` labels!) escape it and widen the whole page on phones.
- Grid and flex children that contain long text need `min-w-0`, and `truncate` text needs a width limit (`max-w-full`), or the item refuses to shrink.
- Full-width buttons with long labels (Persian, German) need `whitespace-normal h-auto`, since buttons don't wrap by default.
- Placeholder art that contains text sizes it with container queries (`@container` + `cqi`), not `vw`.
- Tap targets ≥ 40 px (`min-h-10`), list rows 44–48 px on touch (`pointer-coarse:min-h-11`).
- A quick audit: `document.documentElement.scrollWidth > innerWidth` in phone emulation means something overflows; on a real phone `innerWidth` itself grows (the page zooms out).

## Gotchas found the hard way

- **Never write `-webkit-backdrop-filter` next to `backdrop-filter`.** Lightning CSS (Tailwind v4's build) keeps only the prefixed line, which Chrome ignores: the glass silently lost its blur. Write the standard property alone; the build adds the Safari prefix.
- A sticky grid item needs `self-start`, or the grid stretches it to the row height and it never sticks (admin sidebar).
- A Select or menu inside a modal `<dialog>` must render inside that dialog (everything outside it is inert); `Select` does this itself.

## Contrast

Body text pairs are ≥ 7:1 in both themes (WCAG AAA). Check new pairs before shipping.
