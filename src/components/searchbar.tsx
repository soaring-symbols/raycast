import { Color, Grid, Icon, List } from "@raycast/api";
import type { Alliance } from "soaring-symbols";
import { allianceMark } from "../utils/airlines";

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
  const item = (alliance: Alliance) => {
    const mark = allianceMark(alliance);

    return (
      <Component.Dropdown.Item
        key={alliance.slug}
        title={alliance.name}
        value={alliance.name}
        icon={
          mark
            ? { source: mark.url, tintColor: mark.mono ? Color.PrimaryText : undefined }
            : { source: Icon.TwoPeople, tintColor: Color.SecondaryText }
        }
      />
    );
  };

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
