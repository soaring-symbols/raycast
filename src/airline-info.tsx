import { Action, ActionPanel, List } from "@raycast/api";

import airlines from "./airlines.json";
import { AirlineMeta } from "./types";
import { useEffect, useState } from "react";

const getFlagEmoji = (isoCode?: string) => {
  if (!isoCode) return "🏴";

  if (isoCode === "GB-ENG") {
    return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  }
  if (isoCode === "GB-WLS") {
    return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
  }
  if (isoCode === "GB-SCT") {
    return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  }
  if (isoCode === "GB-NIR") {
    // The only official flag in Northern Ireland is the Union Flag of the United Kingdom.
    return "🇬🇧";
  }

  return isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export default function ViewAirlineInfo() {
  const [filteredAirlines, setFilteredAirlines] = useState<AirlineMeta[]>(airlines as AirlineMeta[]);
  const [alliance, setAlliance] = useState("All");

  useEffect(() => {
    const results = alliance === "All" ? airlines : airlines.filter((a) => a.alliance === alliance);
    setFilteredAirlines(results as AirlineMeta[]);
  }, [alliance]);

  return (
    <List
      searchBarPlaceholder="Search airlines by name, IATA, or ICAO..."
      isShowingDetail={true}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Alliance"
          storeValue
          onChange={(value) => {
            setAlliance(value);
          }}
        >
          <List.Dropdown.Item title="All Airlines" value="All" />
          <List.Dropdown.Section title="Alliance">
            <List.Dropdown.Item title="Star Alliance" value="Star Alliance" />
            <List.Dropdown.Item title="SkyTeam" value="SkyTeam" />
            <List.Dropdown.Item title="oneworld" value="oneworld" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
      throttle
    >
      {filteredAirlines.map((airline) => {
        const accessories: List.Item.Accessory[] = [];
        if (airline.flag_carrier) {
          accessories.push({ text: airline.country.split(",").map(getFlagEmoji).join(" "), tooltip: "Flag Carrier" });
        }
        return (
          <List.Item
            key={airline.iata || airline.name}
            title={airline.name}
            accessories={accessories}
            // icon={`assets/${airline.slug}/icon.svg`}
            keywords={[airline.name, airline.icao, airline.iata, airline.slug]}
            icon={`https://raw.githubusercontent.com/anhthang/soaring-symbols/refs/heads/main/assets/${airline.slug}/icon.svg`}
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Name" text={airline.name} />
                    <List.Item.Detail.Metadata.Label title="IATA" text={airline.iata} />
                    <List.Item.Detail.Metadata.Label title="ICAO" text={airline.icao} />
                    <List.Item.Detail.Metadata.Label title="Country" text={airline.country} />
                    <List.Item.Detail.Metadata.Label title="Alliance" text={airline.alliance} />
                    <List.Item.Detail.Metadata.Link title="Website" text="Website" target={airline.website} />
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <Action.OpenInBrowser title="Open Website" url={airline.website} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
