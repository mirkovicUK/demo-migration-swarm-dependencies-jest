import { describe, it, expect } from "vitest";
import { newId, newShortRef, isValidId } from "../js/id.js";

describe("newId returns a non-empty unique string", () => {
  it("generates different ids", () => {
    const a = newId();
    const b = newId();
    expect(a).toHaveLengthGreaterThan(0);
    expect(a).not.toBe(b);
  });
});

describe("newShortRef uses only the safe alphabet, no ambiguous chars", () => {
  it("generates an 8-character string with safe characters", () => {
    const ref = newShortRef();
    expect(ref).toHaveLength(8);
    expect(ref).toMatch(/^[2-9A-HJ-NP-Z]+$/);
  });
});

describe("isValidId rejects non-strings and empty strings", () => {
  it("validates id correctness", () => {
    expect(isValidId("abc")).toBe(true);
    expect(isValidId("")).toBe(false);
    expect(isValidId(null)).toBe(false);
    expect(isValidId(42)).toBe(false);
  });
});