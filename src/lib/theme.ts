export type ThemeId = "ultramarine" | "papaya";

export const THEME_STORAGE_KEY = "jlorup-theme";
export const DEFAULT_THEME: ThemeId = "ultramarine";

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "ultramarine", label: "Ultramarine", swatch: "#1500e1" },
  { id: "papaya", label: "Papaya", swatch: "#c13383" },
];

export function isThemeId(value: string | null): value is ThemeId {
  return value === "ultramarine" || value === "papaya";
}
