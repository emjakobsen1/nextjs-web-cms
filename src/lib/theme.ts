export type ThemeId = "ultramarine" | "forest" | "eclipse";

export const THEME_STORAGE_KEY = "jlorup-theme";
export const DEFAULT_THEME: ThemeId = "ultramarine";

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "ultramarine", label: "Ultramarine", swatch: "#1500e1" },
  { id: "forest", label: "Forest", swatch: "#0e8388" },
  { id: "eclipse", label: "Eclipse", swatch: "#ffd51e" },
];

export function isThemeId(value: string | null): value is ThemeId {
  return value === "ultramarine" || value === "forest" || value === "eclipse";
}
