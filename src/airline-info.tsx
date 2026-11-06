import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useMemo, useState } from "react";
import { ceasedLabel, getFlagEmoji, operatingYears } from "./utils";
import type { Airline } from "soaring-symbols";
import { groupAirlines, previewUrl, searchKeywords } from "./utils/airlines";
import { fetchAirlines } from "./utils/fetch";
import SearchBar from "./components/searchbar";

export default function ViewAirlineInfo() {
  const { isLoading, data = [] } = useCachedPromise(fetchAirlines);
  const [alliance, setAlliance] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Parents and subsidiaries come from the whole list, whatever the filter
  const groups = useMemo(() => groupAirlines(data), [data]);

  // Jump to a related airline: search for it with the alliance filter cleared
  const showAirline = (name: string) => {
    setAlliance("All");
    setSearchText(name);
  };

  const filteredAirlines = useMemo(() => {
    if (alliance === "All") return data;
    return data.filter((a) => a.alliance === alliance);
  }, [data, alliance]);

  return (
    <List
      isLoading={isLoading}
      throttle
      isShowingDetail
      filtering
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search airlines by name, IATA, or ICAO..."
      searchBarAccessory={<SearchBar type="list" selected={alliance} onSelect={setAlliance} />}
    >
      {filteredAirlines.map((airline: Airline) => {
        const flags = airline.country
          ?.split(",")
          .map((c) => getFlagEmoji(c))
          .join(" ");

        const logo = previewUrl(airline, "logo");
        const ceased = ceasedLabel(airline);
        const years = operatingYears(airline);
        const parent = groups.parents.get(airline.slug);
        const subsidiaries = groups.subsidiaries.get(airline.slug) ?? [];
        const accessories: List.Item.Accessory[] = [];
        if (ceased)
          accessories.push({ icon: { source: Icon.AirplaneLanding, tintColor: Color.SecondaryText }, tooltip: ceased });
        if (airline.flag_carrier) accessories.push({ text: flags, tooltip: "Flag Carrier" });

        const markdown = logo ? `<img src="${logo}" alt="${airline.name}" width="200" height="200" />` : "";

        return (
          <List.Item
            key={airline.slug}
            title={airline.name}
            icon={{
              source: previewUrl(airline, "icon") ?? "",
              fallback: Icon.CircleProgress,
            }}
            keywords={searchKeywords(airline)}
            accessories={accessories}
            detail={
              <List.Item.Detail
                markdown={markdown}
                metadata={
                  <List.Item.Detail.Metadata>
                    {airline.branding?.tagline && (
                      <List.Item.Detail.Metadata.Label title="Tagline" text={airline.branding.tagline} />
                    )}
                    <List.Item.Detail.Metadata.Label title="IATA" text={airline.iata} />
                    <List.Item.Detail.Metadata.Label title="ICAO" text={airline.icao} />
                    {airline.callsign && <List.Item.Detail.Metadata.Label title="Callsign" text={airline.callsign} />}
                    {years && (
                      <List.Item.Detail.Metadata.Label title={airline.ceased ? "Operated" : "Founded"} text={years} />
                    )}
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Country" text={airline.country} />
                    <List.Item.Detail.Metadata.Label title="Alliance" text={airline.alliance} />
                    {airline.hubs?.length ? (
                      <List.Item.Detail.Metadata.TagList title={airline.hubs.length > 1 ? "Hubs" : "Hub"}>
                        {airline.hubs.map((hub) => (
                          <List.Item.Detail.Metadata.TagList.Item key={hub} text={hub} />
                        ))}
                      </List.Item.Detail.Metadata.TagList>
                    ) : null}
                    {parent && (
                      <List.Item.Detail.Metadata.TagList title="Part of">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={parent.name}
                          onAction={() => showAirline(parent.name)}
                        />
                      </List.Item.Detail.Metadata.TagList>
                    )}
                    {subsidiaries.length > 0 && (
                      <List.Item.Detail.Metadata.TagList title="Subsidiaries">
                        {subsidiaries.map((sub) => (
                          <List.Item.Detail.Metadata.TagList.Item
                            key={sub.slug}
                            text={sub.name}
                            onAction={() => showAirline(sub.name)}
                          />
                        ))}
                      </List.Item.Detail.Metadata.TagList>
                    )}
                    {airline.website && (
                      <>
                        <List.Item.Detail.Metadata.Separator />
                        <List.Item.Detail.Metadata.Link
                          title="Website"
                          text={airline.website.replace(/^https?:\/\//, "")}
                          target={airline.website}
                        />
                      </>
                    )}
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                {airline.website && <Action.OpenInBrowser title="Open Website" url={airline.website} />}
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
