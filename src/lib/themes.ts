export type Palette = "lumivara" | "earth" | "slate" | "forest";

export const PALETTE_STORAGE_KEY = "lumivara-palette";
export const DEFAULT_PALETTE: Palette = "lumivara";

export type PaletteEntry = {
  id: Palette;
  label: string;
  description: string;
  swatch: string;
};

export const palettes: PaletteEntry[] = [
  {
    id: "lumivara",
    label: "Lumivara",
    description: "Warm editorial — cream, ink, amber accent",
    swatch: "#c8912e",
  },
  {
    id: "earth",
    label: "Warm earth",
    description: "Ochre, terracotta, cream — approachable",
    swatch: "#b04e2e",
  },
  {
    id: "slate",
    label: "Cool slate",
    description: "Slate blue, soft white, charcoal — consulting",
    swatch: "#4a6eaa",
  },
  {
    id: "forest",
    label: "Deep forest",
    description: "Forest green, bone, dark ink — advisory",
    swatch: "#2f6b3e",
  },
];

export function isPalette(value: unknown): value is Palette {
  return (
    value === "lumivara" ||
    value === "earth" ||
    value === "slate" ||
    value === "forest"
  );
}
