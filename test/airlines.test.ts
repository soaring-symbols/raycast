// Run with `npm test` (Node's built-in test runner, which strips the types).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { groupAirlines, isAirlineList } from "../src/utils/airlines.ts";

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
