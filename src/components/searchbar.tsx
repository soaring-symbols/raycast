import { Color, Grid, Icon, type Image, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useMemo, useState } from "react";
import type { Alliance } from "soaring-symbols";
import { allianceMark, isMemberOf } from "../utils/airlines";
import { fetchAirlines, fetchAlliances } from "../utils/fetch";

// An alliance's mark as a Raycast image, monochrome ones tinted to the
// theme; a neutral group icon while the collection has no mark for it
export const allianceIcon = (alliance?: Alliance): Image.ImageLike => {
  const mark = allianceMark(alliance);

  return mark
    ? { source: mark.url, tintColor: mark.mono ? Color.PrimaryText : undefined }
    : { source: Icon.TwoPeople, tintColor: Color.SecondaryText };
};

// Both lists and the airlines the alliance filter lets through, for the
// commands that show the filter. `initial` opens on one alliance.
export function useAllianceFilter(initial = "All") {
  const { isLoading, data: airlines = [] } = useCachedPromise(fetchAirlines);
  const { data: alliances = [] } = useCachedPromise(fetchAlliances);
  const [alliance, setAlliance] = useState(initial);

  const byName = useMemo(() => new Map(alliances.map((a) => [a.name, a])), [alliances]);
  const filtered = useMemo(() => {
    const selected = byName.get(alliance);
    return selected ? airlines.filter((a) => isMemberOf(a, selected)) : airlines;
  }, [airlines, byName, alliance]);

  return { isLoading, airlines, alliances, byName, alliance, setAlliance, filtered };
}

// The alliance filter: every alliance in the collection, active ones first,
// each with its mark. `storeValue` keeps the last choice between launches;
// a list opened for one alliance passes false so it isn't overridden.
export default function SearchBar(props: {
  type: string;
  alliances: Alliance[];
  selected: string;
  onSelect: (value: string) => void;
  storeValue?: boolean;
}) {
  const { type, alliances, selected, onSelect, storeValue = true } = props;

  const Component = type === "grid" ? Grid : List;
  const item = (alliance: Alliance) => (
    <Component.Dropdown.Item
      key={alliance.slug}
      title={alliance.name}
      value={alliance.name}
      icon={allianceIcon(alliance)}
    />
  );

  return (
    <Component.Dropdown tooltip="Filter by Alliance" storeValue={storeValue} value={selected} onChange={onSelect}>
      <Component.Dropdown.Item title="All Airlines" value="All" />
      <Component.Dropdown.Section title="Alliances">
        {alliances.filter((a) => !a.defunct).map(item)}
      </Component.Dropdown.Section>
      <Component.Dropdown.Section title="Disbanded">
        {alliances.filter((a) => a.defunct).map(item)}
      </Component.Dropdown.Section>
    </Component.Dropdown>
  );
}
