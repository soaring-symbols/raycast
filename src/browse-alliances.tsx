import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useMemo } from "react";
import type { Alliance } from "soaring-symbols";
import { allianceMark, allianceTiles, allianceYears, isMemberOf } from "./utils/airlines";
import { fetchAirlines, fetchAlliances } from "./utils/fetch";
import AirlineGrid from "./components/airline-grid";
import { AllianceAssets } from "./components/assets";

export default function BrowseAlliances() {
  const { isLoading, data: alliances = [] } = useCachedPromise(fetchAlliances);
  const { data: airlines = [] } = useCachedPromise(fetchAirlines);

  // How many airlines in the collection fly, or flew, in each
  const memberCounts = useMemo(
    () => new Map(alliances.map((alliance) => [alliance.slug, airlines.filter((a) => isMemberOf(a, alliance)).length])),
    [alliances, airlines],
  );

  const renderItem = (alliance: Alliance) => {
    const mark = allianceMark(alliance);
    const members = memberCounts.get(alliance.slug) ?? 0;
    const hasTiles = allianceTiles(alliance).length > 0;

    return (
      <Grid.Item
        key={alliance.slug}
        content={
          mark
            ? { source: mark.url, tintColor: mark.mono ? Color.PrimaryText : undefined }
            : { source: Icon.TwoPeople, tintColor: Color.SecondaryText }
        }
        title={alliance.name}
        subtitle={[allianceYears(alliance), `${members} airline${members === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · ")}
        keywords={[alliance.slug, alliance.branding?.tagline].filter((k): k is string => Boolean(k))}
        actions={
          <ActionPanel>
            <ActionPanel.Section title="Alliance">
              <Action.Push
                title="Show Member Airlines"
                icon={Icon.AirplaneFilled}
                target={<AirlineGrid alliance={alliance.name} />}
              />
              {hasTiles && (
                <Action.Push
                  title="View Alliance Assets"
                  icon={Icon.AppWindowGrid2x2}
                  target={<AllianceAssets {...alliance} />}
                />
              )}
              {alliance.website && <Action.OpenInBrowser title="Open Website" url={alliance.website} />}
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    );
  };

  return (
    <Grid isLoading={isLoading} columns={4} inset={Grid.Inset.Large} searchBarPlaceholder="Search alliances...">
      <Grid.Section title="Alliances">{alliances.filter((a) => !a.defunct).map(renderItem)}</Grid.Section>
      <Grid.Section title="Disbanded">{alliances.filter((a) => a.defunct).map(renderItem)}</Grid.Section>
    </Grid>
  );
}
