# Soaring Symbols Changelog

## [Boarding Pass] - {PR_MERGE_DATE}

- Airline Information now shows each airline's radio callsign, hub airports and the year it was founded (or the years it flew, for airlines that no longer operate).
- Find airlines by their callsign in both commands.
- Airline Information shows the group an airline belongs to and the airlines it owns, such as Thai AirAsia under AirAsia; select one to jump to it.
- Airlines that no longer fly are marked: a landed plane in Airline Information, with the year it ceased in its tooltip, and "Ceased" with the year in Browse Airlines.
- See an airline's earlier logos below its current ones in the assets grid, one section per logo with the year it was introduced, such as Sun PhuQuoc Airways' 2025 logo. Copy and download work as for current marks.

## [New Livery] - 2026-11-05

- New extension icon: the Soaring Symbols split-flap mark, matching the website.
- Fix the empty assets grid after the Soaring Symbols data update: tiles now come from the new `assets` field, and multi-color marks without a monochrome version no longer show a broken `-mono` tile.
- Show marks that only ship a monochrome file, such as the Qantas icon.
- Tint every monochrome version to match the Raycast theme.
- Load airlines and SVGs from the released Soaring Symbols package, so new airlines still arrive automatically but library changes can no longer break the extension.
- Fall back to the airline list bundled with the extension when the latest one can't be loaded, and show the last loaded list right away.

## [Departure] - 2026-06-03

- Initial release of Soaring Symbols.
