import { Grid } from "@raycast/api";
import { AirlineMeta } from "../types";

const assetTypes = {
  Logo: ["logo", "logo-mono"],
  Icon: ["icon", "icon-mono"],
};

const slugToName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AirlineAssets(airline: AirlineMeta) {
  const assets = Object.entries(assetTypes).map(([type, variants]) => {
    return (
      <Grid.Section
        title={type}
        key={type}
        children={variants.map((variant) => {
          return (
            <Grid.Item
              key={variant}
              content={{
                source: `https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/assets/${airline.slug}/${variant}.svg`,
              }}
              title={slugToName(variant)}
            />
          );
        })}
      />
    );
  });

  return <Grid columns={4} inset={Grid.Inset.Small} throttle navigationTitle={airline.name} children={assets} />;
}
