import { Airline, AssetInfo, AssetType } from "../types";

const REPO_RAW = "https://raw.githubusercontent.com/soaring-symbols/soaring-symbols/refs/heads/main";

export const AIRLINES_URL = `${REPO_RAW}/airlines.json`;

const ASSET_TYPES: AssetType[] = ["logo", "icon", "tail"];

const assetUrl = (airline: Airline, file: string) => `${REPO_RAW}/assets/${airline.slug}/${file}.svg`;

// Which files an airline ships for one asset type. Data published before the
// `assets` field only listed colors per color file; there, a multi-color
// asset was always expected to have a -mono file.
const getAssetInfo = (airline: Airline, type: AssetType): AssetInfo | undefined => {
  if (airline.assets) return airline.assets[type];

  const colors = airline.branding?.colors?.[type];
  if (!Array.isArray(colors)) return undefined;

  return { color: true, mono: colors.length !== 1, colors };
};

interface AssetTile {
  /** Tile id and download name, e.g. "logo" or "logo-mono". */
  variant: string;
  url: string;
  /** A monochrome version, drawn in one color that the extension tints. */
  mono: boolean;
}

// A color tile when the color file exists, and a mono tile when there is a
// -mono file. The library generates one for every single-color asset; data
// published before that only had the color file, which is tinted instead.
export const getAssetTiles = (airline: Airline): AssetTile[] =>
  ASSET_TYPES.flatMap((type) => {
    const info = getAssetInfo(airline, type);
    if (!info) return [];

    const tiles: AssetTile[] = [];
    if (info.color) tiles.push({ variant: type, url: assetUrl(airline, type), mono: false });
    const monoFile = info.mono ? `${type}-mono` : info.color && info.colors.length === 1 ? type : undefined;
    if (monoFile) tiles.push({ variant: `${type}-mono`, url: assetUrl(airline, monoFile), mono: true });

    return tiles;
  });

// The first file to show for a type: its color version, else its mono one
export const previewUrl = (airline: Airline, type: AssetType): string | undefined => {
  const info = getAssetInfo(airline, type);
  if (!info) return undefined;

  return assetUrl(airline, info.color ? type : `${type}-mono`);
};
