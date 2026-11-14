import { ActionPanel, Action, Grid, Icon } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useMemo, useState } from "react";
import { ceasedLabel, getFlagEmoji } from "../utils";
import { isMemberOf, previewUrl, searchKeywords } from "../utils/airlines";
import { fetchAirlines, fetchAlliances } from "../utils/fetch";
import AirlineAssets from "./assets";
import SearchBar from "./searchbar";

// The airline grid of Browse Airlines, also opened from Browse Alliances on
// one alliance's members (`alliance`, without remembering that filter)
export default function AirlineGrid({ alliance: initial = "All" }: { alliance?: string }) {
  const { isLoading, data = [] } = useCachedPromise(fetchAirlines);
  const { data: alliances = [] } = useCachedPromise(fetchAlliances);
  const [alliance, setAlliance] = useState(initial);

  const filteredAirlines = useMemo(() => {
    const selected = alliances.find((a) => a.name === alliance);
    if (!selected) return data;
    return data.filter((a) => isMemberOf(a, selected));
  }, [alliance, alliances, data]);

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
