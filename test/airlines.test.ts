// Run with `npm test` (Node's built-in test runner, which strips the types).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  airlinesUrl,
  earlierMarks,
  getAssetTiles,
  groupAirlines,
  isAirlineList,
  isLineRelease,
  setDataVersion,
} from "../src/utils/airlines.ts";

const airline = { name: "Vietnam Airlines", slug: "vietnam-airlines", assets: { logo: { color: true, mono: true } } };

describe("isAirlineList", () => {
  it("accepts a list of airlines with slugs and assets", () => {
    assert.equal(isAirlineList([airline, { ...airline, slug: "qantas", assets: {} }]), true);
  });

  it("rejects an empty list, so the bundled one is used instead", () => {
    assert.equal(isAirlineList([]), false);
  });

  it("rejects anything that isn't a list", () => {
    for (const data of [null, undefined, {}, "airlines", { airlines: [airline] }]) {
      assert.equal(isAirlineList(data), false, JSON.stringify(data));
    }
  });

  it("rejects a list with an entry missing its slug or assets", () => {
    assert.equal(isAirlineList([airline, { ...airline, slug: undefined }]), false);
    assert.equal(isAirlineList([airline, { ...airline, assets: undefined }]), false);
    assert.equal(isAirlineList([airline, { ...airline, assets: null }]), false);
    assert.equal(isAirlineList([airline, null]), false);
  });
});

describe("groupAirlines", () => {
  const parent = { ...airline, name: "AirAsia", slug: "airasia" };
  const thai = { ...airline, name: "Thai AirAsia", slug: "thai-airasia", parent: "airasia" };
  const indonesia = { ...airline, name: "Indonesia AirAsia", slug: "indonesia-airasia", parent: "airasia" };

  it("finds each airline's parent and each parent's subsidiaries", () => {
    const { parents, subsidiaries } = groupAirlines([parent, thai, indonesia, airline]);
    assert.equal(parents.get("thai-airasia"), parent);
    assert.deepEqual(subsidiaries.get("airasia"), [thai, indonesia]);
    assert.equal(parents.get("vietnam-airlines"), undefined);
    assert.equal(subsidiaries.get("vietnam-airlines"), undefined);
  });

  it("skips a parent that isn't in the list", () => {
    const { parents, subsidiaries } = groupAirlines([thai]);
    assert.equal(parents.size, 0);
    assert.equal(subsidiaries.size, 0);
  });
});

describe("getAssetTiles and earlierMarks", () => {
  const info = (color: boolean, mono: boolean) => ({ color, mono, colors: [] });
  const korean = {
    ...airline,
    name: "Korean Air",
    slug: "korean-air",
    assets: { logo: info(true, true) },
    history: [
      { since: 1969, assets: { logo: info(true, false) } },
      { since: 1984, assets: { logo: info(true, false), icon: info(true, true) } },
    ],
  };
  const base = "https://cdn.jsdelivr.net/npm/soaring-symbols@0.2/dist/assets/korean-air";

  it("lists the current files without a mark", () => {
    assert.deepEqual(
      getAssetTiles(korean).map(({ url, fileName }) => [url, fileName]),
      [
        [`${base}/logo.svg`, "korean-air-logo.svg"],
        [`${base}/logo-mono.svg`, "korean-air-logo-mono.svg"],
      ],
    );
  });

  it("lists an older mark's files from its history folder", () => {
    const [newest] = earlierMarks(korean);
    assert.equal(newest.since, 1984);
    assert.deepEqual(
      getAssetTiles(korean, newest).map(({ url, fileName, mono }) => [url, fileName, mono]),
      [
        [`${base}/history/1984/logo.svg`, "korean-air-1984-logo.svg", false],
        [`${base}/history/1984/icon.svg`, "korean-air-1984-icon.svg", false],
        [`${base}/history/1984/icon-mono.svg`, "korean-air-1984-icon-mono.svg", true],
      ],
    );
  });

  it("orders older marks newest first and handles data without history", () => {
    assert.deepEqual(
      earlierMarks(korean).map((mark) => mark.since),
      [1984, 1969],
    );
    assert.deepEqual(earlierMarks(airline), []);
  });
});

describe("exact release URLs", () => {
  const korean = { ...airline, name: "Korean Air", slug: "korean-air" };
  const cdn = "https://cdn.jsdelivr.net/npm/soaring-symbols";

  it("accepts only exact releases of the line", () => {
    assert.equal(isLineRelease("0.2.4"), true);
    for (const version of ["0.2", "0.3.0", "0.2.4-beta", "10.2.4", undefined, 24]) {
      assert.equal(isLineRelease(version), false, String(version));
    }
  });

  it("loads airlines.json from the release, or the line when it's unknown", () => {
    assert.equal(airlinesUrl("0.2.4"), `${cdn}@0.2.4/dist/airlines.json`);
    assert.equal(airlinesUrl(undefined), `${cdn}@0.2/dist/airlines.json`);
    assert.equal(airlinesUrl("latest"), `${cdn}@0.2/dist/airlines.json`);
  });

  it("loads files from the release the list came from", () => {
    setDataVersion("0.2.4");
    assert.equal(getAssetTiles(korean)[0].url, `${cdn}@0.2.4/dist/assets/korean-air/logo.svg`);
    setDataVersion("0.3.0");
    assert.equal(getAssetTiles(korean)[0].url, `${cdn}@0.2/dist/assets/korean-air/logo.svg`);
    setDataVersion();
    assert.equal(getAssetTiles(korean)[0].url, `${cdn}@0.2/dist/assets/korean-air/logo.svg`);
  });
});
