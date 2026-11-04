# AGENTS.md

Instructions for AI coding agents working on the Soaring Symbols Raycast extension.

## Project

A Raycast extension for browsing the [Soaring Symbols](https://github.com/soaring-symbols/soaring-symbols) airline logos, icons and tails.

- `src/browse-airlines.tsx` and `src/airline-info.tsx` — the two commands declared in `package.json`.
- `src/components/assets.tsx` — the per-airline grid of SVG files, with copy and download actions.
- `src/utils/airlines.ts` — data and SVG URLs, and the helpers that decide which asset tiles to show.
- `src/types.ts` — the shape of `airlines.json`.
- `assets/extension-icon.png` — the store icon, a 512×512 PNG. It is exported from `brand/raycast-icon-signal.png` in the [website repo](https://github.com/soaring-symbols/website); change it there first.
- `metadata/` — store screenshots (2000×1250), taken in Raycast.

The extension does not bundle airline data. At runtime it fetches `airlines.json` and the SVGs from the `main` branch of `soaring-symbols/soaring-symbols`. A data change merged there reaches every installed copy at once, without a store release. So:

- Keep the extension working with the data on `main` and with the next shape about to land there. When the library changes `airlines.json`, ship an extension update that reads both shapes before the library change merges.
- Describe `airlines.json` in `src/types.ts`, not with types from the `soaring-symbols` npm package. The package describes a release, which can lag behind `main`.

## Commands

| Command            | What it does                                                           |
| :----------------- | :--------------------------------------------------------------------- |
| `npm run dev`      | Run the extension in Raycast in development mode.                      |
| `npm run build`    | Build it (`ray build`), including the TypeScript check.                |
| `npm run lint`     | Validate the manifest and icons, then run ESLint and Prettier.         |
| `npm run fix-lint` | Same, fixing what can be fixed.                                        |
| `npm run publish`  | Open a pull request to the Raycast Store. Only the maintainer runs it. |

Dependencies are tracked in both `package-lock.json` and `bun.lock`; update both together.

## Naming

Give names that people see on the store an aviation, airline or travel flavor that fits what the change does. This covers changelog entry titles, new command titles, and section or action labels when a plain label isn't required for clarity. Examples:

- `Departure`: the first release.
- `New Livery`: a new icon or visual refresh.
- `Course Correction`: bug fixes.
- `Extra Legroom`: layout or usability improvements.
- `New Routes`: new commands or features.
- `Cleared for Takeoff`: a feature leaving beta.

Keep the name short (one to three words), in Title Case, and don't reuse one already in `CHANGELOG.md`. Clarity comes first: an action like "Copy SVG" stays literal, and code identifiers, file names and commit messages follow normal conventions.

## Changelog

Every user-facing change adds an entry at the top of `CHANGELOG.md`, using the store's format with the date placeholder, which the store fills in on merge:

```markdown
## [New Livery] - {PR_MERGE_DATE}

- What changed, written for users.
```

## Conventions

- Prettier with `printWidth: 120` and double quotes, ESLint from `@raycast/eslint-config`. Run `npm run lint` before committing.
- Commits follow Conventional Commits, e.g. `feat: add tail filter`, `fix: skip missing mono files`.
