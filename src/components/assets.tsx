import { Action, ActionPanel, Clipboard, Grid, Icon, showToast, Toast } from "@raycast/api";
import fs from "fs";
import path from "path";
import { AirlineMeta } from "soaring-symbols";
import { getSVGContent } from "../utils/fetch";

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

const isProbablySvg = (text: string): boolean => {
  const t = text.trim();
  return t.startsWith("<svg") && t.endsWith("</svg>");
};

const getDownloadsDir = (): string => {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  // macOS/Linux convention
  const dl = path.join(home, "Downloads");
  return dl;
};

export default function AirlineAssets(airline: AirlineMeta) {
  const assets = Object.values(assetTypes)
    .map((variants) => {
      return variants.map(async (variant) => {
        const source = `https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/assets/${airline.slug}/${variant}.svg`;

        return (
          <Grid.Item
            key={variant}
            content={{
              source,
            }}
            title={slugToName(variant)}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="SVG Actions">
                  <Action
                    title="Copy SVG"
                    icon={Icon.CopyClipboard}
                    onAction={async () => {
                      const svg = await getSVGContent(source);
                      await Clipboard.copy(svg);
                      await showToast({ style: Toast.Style.Success, title: "SVG copied to clipboard" });
                    }}
                  />
                  <Action
                    title="Download SVG…"
                    icon={Icon.Download}
                    onAction={async () => {
                      try {
                        const svg = await getSVGContent(source);
                        const defaultFilename = `${airline.slug}-${variant}.svg`;

                        const downloadsDir = getDownloadsDir();
                        const filePath = path.join(downloadsDir, defaultFilename);

                        // Validate basic SVG structure before writing
                        if (!isProbablySvg(svg)) {
                          await showToast({ style: Toast.Style.Failure, title: "Invalid SVG content" });
                          return;
                        }

                        fs.writeFileSync(filePath, svg, { encoding: "utf-8" });
                        await showToast({
                          style: Toast.Style.Success,
                          title: "SVG downloaded",
                          message: filePath,
                        });
                      } catch (err) {
                        await showToast({
                          style: Toast.Style.Failure,
                          title: "Failed to save SVG",
                          message: (err as Error)?.message ?? "Unknown error",
                        });
                      }
                    }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
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
