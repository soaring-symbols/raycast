import { ActionPanel, Action, Grid, Icon } from "@raycast/api";
import { ceasedLabel, getFlagEmoji } from "../utils";
import { previewUrl, searchKeywords } from "../utils/airlines";
import AirlineAssets from "./assets";
import type { Airline, Alliance } from "soaring-symbols";
import { useAllianceFilter } from "./alliances";
import SearchBar from "./searchbar";

// The airline grid of Browse Airlines, also opened from Browse Alliances on
// one alliance's members (`alliance`, without remembering that filter, and
// the `lists` it already loaded)
export default function AirlineGrid({
  alliance: initial = "All",
  lists,
}: {
  alliance?: string;
  lists?: { airlines: Airline[]; alliances: Alliance[] };
}) {
  const { isLoading, alliances, alliance, setAlliance, filtered: filteredAirlines } = useAllianceFilter(initial, lists);

  return (
    <Grid
      isLoading={isLoading}
      columns={4}
      inset={Grid.Inset.Small}
      searchBarPlaceholder="Search airlines by name, IATA, or ICAO..."
      searchBarAccessory={
        <SearchBar
          type="grid"
          alliances={alliances}
          selected={alliance}
          onSelect={setAlliance}
          storeValue={initial === "All"}
        />
      }
    >
      <Grid.Section title={alliance === "All" ? "All Airlines" : alliance}>
        {filteredAirlines.map((airline) => (
          <Grid.Item
            key={airline.slug}
            content={{ source: previewUrl(airline, "logo") ?? "", fallback: Icon.AirplaneFilled }}
            title={airline.name}
            subtitle={[airline.iata, ceasedLabel(airline)].filter(Boolean).join(" · ")}
            keywords={searchKeywords(airline)}
            accessory={
              airline.flag_carrier
                ? {
                    icon: getFlagEmoji(airline.country?.split(",")?.[0]),
                    tooltip: "Flag Carrier",
                  }
                : undefined
            }
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Airline Information">
                  <Action.Push
                    title="View Airline Assets"
                    icon={Icon.AppWindowGrid2x2}
                    target={<AirlineAssets {...airline} />}
                  />
                  {airline.website && <Action.OpenInBrowser title="Open Website" url={airline.website} />}
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </Grid.Section>
    </Grid>
  );
}
