// Shape of airlines.json on the soaring-symbols main branch, which the
// extension fetches at runtime (so it follows main, not an npm release).

export type AssetType = "logo" | "icon" | "tail";

export interface AssetInfo {
  /** `<type>.svg` (full color) exists. */
  color: boolean;
  /** `<type>-mono.svg` exists. */
  mono: boolean;
  /** Hex colors the color file paints with, gradient stops included. */
  colors: string[];
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
  country: string;
  slug: string;
  website?: string;
  flag_carrier?: boolean;
  alliance?: string;
  branding?: {
    primary_color?: string;
    tagline?: string;
    guidelines?: string;
    /** Data before `assets` existed: colors per type with a color file. */
    colors?: Partial<Record<AssetType, string[]>>;
  };
  assets?: Partial<Record<AssetType, AssetInfo>>;
}
