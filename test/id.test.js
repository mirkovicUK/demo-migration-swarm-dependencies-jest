// test/id.test.js — Jest (ESM). APIs imported from @jest/globals so this repo
// exercises the migrator's Jest -> Vitest test conversion.
import { describe, it, expect } from "@jest/globals";
import { newId, newShortRef, isValidId } from "../js/id.js";

describe("id", () => {
  it("newId returns a non-empty unique string", () => {
    const a = newId();
    const b = newId();
    expect(a.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });

  it("newShortRef uses only the safe alphabet, no ambiguous chars", () => {
    const ref = newShortRef();
    expect(ref).toHaveLength(8);
    expect(ref).toMatch(/^[2-9A-HJ-NP-Z]+$/);
  });

  it("isValidId rejects non-strings and empty strings", () => {
    expect(isValidId("abc")).toBe(true);
    expect(isValidId("")).toBe(false);
    expect(isValidId(null)).toBe(false);
    expect(isValidId(42)).toBe(false);
  });
});
