export const paletteScales = [
  { name: "oat", label: "Oat Silk", anchor: { step: 300, hex: "#E2D8CB" } },
  { name: "mulberry", label: "Mulberry Kiss", anchor: { step: 800, hex: "#56061D" } },
  { name: "reverie", label: "Blue Reverie", anchor: { step: 500, hex: "#507593" } },
  { name: "midnight", label: "Midnight Custard", anchor: { step: 800, hex: "#022E4A" } },
] as const;

export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export const semanticTokens = [
  { token: "background", pair: "foreground" },
  { token: "primary", pair: "primary-foreground" },
  { token: "secondary", pair: "secondary-foreground" },
  { token: "accent", pair: "accent-foreground" },
  { token: "muted", pair: "muted-foreground" },
  { token: "brand", pair: "background" },
  { token: "success", pair: "background" },
  { token: "warning", pair: "background" },
  { token: "danger", pair: "background" },
  { token: "info", pair: "background" },
] as const;
