import { ActionPanel, Action, Grid, Icon } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useMemo, useState } from "react";
import AirlineAssets from "./components/assets";
import { getFlagEmoji } from "./utils";
import { fetchAirlines } from "./utils/fetch";

export default function BrowseAirlines() {
  const { isLoading, data = [] } = usePromise(fetchAirlines);
  const [alliance, setAlliance] = useState("All");

  const filteredAirlines = useMemo(() => {
    if (alliance === "All") return data;
    return data.filter((a) => a.alliance === alliance);
  }, [alliance, data]);

  return (
    <Grid
      isLoading={isLoading}
      columns={4}
      inset={Grid.Inset.Small}
      searchBarPlaceholder="Search airlines by name, IATA, or ICAO..."
      searchBarAccessory={
        <Grid.Dropdown tooltip="Filter by Alliance" storeValue value={alliance} onChange={setAlliance}>
          <Grid.Dropdown.Item title="All Airlines" value="All" />
          <Grid.Dropdown.Section title="Alliances">
            <Grid.Dropdown.Item title="Star Alliance" value="Star Alliance" />
            <Grid.Dropdown.Item title="SkyTeam" value="SkyTeam" />
            <Grid.Dropdown.Item title="oneworld" value="oneworld" />
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      <Grid.Section title={alliance === "All" ? "All Airlines" : alliance}>
        {filteredAirlines.map((airline) => (
          <Grid.Item
            key={airline.iata}
            content={{
              source: `https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/assets/${airline.slug}/logo.svg`,
            }}
            title={airline.name}
            subtitle={airline.iata}
            keywords={[airline.name, airline.iata, airline.icao, airline.slug].filter(Boolean)}
            accessory={
              airline.flag_carrier
                ? {
                    icon: getFlagEmoji(airline.country.split(",")[0]),
                    tooltip: "Flag Carrier",
                  }
                : undefined
            }
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Airline Information">
                  <Action.Push
                    title="View Airline Assets"
                    icon={Icon.Sidebar}
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
