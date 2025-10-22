import { ActionPanel, Action, Grid, Icon } from "@raycast/api";
import { useEffect, useState } from "react";

import airlines from "./airlines.json";
import AirlineAssets from "./components/assets";
import { AirlineMeta } from "./types";

export default function BrowseAirlines() {
  const [filteredAirlines, setFilteredAirlines] = useState<AirlineMeta[]>(airlines as AirlineMeta[]);
  const [alliance, setAlliance] = useState("All");

  useEffect(() => {
    const results = alliance === "All" ? airlines : airlines.filter((a) => a.alliance === alliance);
    setFilteredAirlines(results as AirlineMeta[]);
  }, [alliance]);

  return (
    <Grid
      columns={4}
      inset={Grid.Inset.Small}
      navigationTitle="Search Airlines"
      searchBarPlaceholder="Search airlines by name, IATA, or ICAO..."
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Select Alliance"
          storeValue
          onChange={(value) => {
            setAlliance(value);
          }}
        >
          <Grid.Dropdown.Item title="All Airlines" value="All" />
          <Grid.Dropdown.Section title="Alliance">
            <Grid.Dropdown.Item title="Star Alliance" value="Star Alliance" />
            <Grid.Dropdown.Item title="SkyTeam" value="SkyTeam" />
            <Grid.Dropdown.Item title="oneworld" value="oneworld" />
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      <Grid.Section>
        {filteredAirlines.map((airline) => (
          <Grid.Item
            key={airline.iata}
            content={{
              source: `https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/assets/${airline.slug}/logo.svg`,
            }}
            title={airline.name}
            subtitle={airline.iata}
            keywords={[airline.name, airline.iata, airline.icao, airline.slug]}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Information">
                  <Action.Push title="Airline Assets" icon={Icon.Sidebar} target={<AirlineAssets {...airline} />} />
                  <Action.OpenInBrowser title="Website" url={airline.website} />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </Grid.Section>
    </Grid>
  );
}
