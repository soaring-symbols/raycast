import { Grid } from "@raycast/api";
import { AirlineMeta } from "soaring-symbols";

const assetTypes = {
  Logo: ["logo", "logo-mono"],
  Icon: ["icon", "icon-mono"],
  Tail: ["tail", "tail-mono"],
};

const slugToName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AirlineAssets(airline: AirlineMeta) {
  const assets = Object.values(assetTypes)
    .map((variants) => {
      return variants.map((variant) => {
        return (
          <Grid.Item
            key={variant}
            content={{
              source: `https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/assets/${airline.slug}/${variant}.svg`,
            }}
            title={slugToName(variant)}
          />
        );
      });
    })
    .flat();

  return (
    <Grid
      columns={4}
      inset={Grid.Inset.Small}
      throttle
      navigationTitle={`${airline.name} | Assets`}
      children={assets}
    />
  );
}
