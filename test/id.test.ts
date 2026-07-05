import { test, expect } from "vitest";
import { newId, newShortRef, isValidId } from "../js/id";

test("newId returns a non-empty unique string", () => {
  const a = newId();
  const b = newId();
  expect(a).toHaveLengthGreaterThan(0);
  expect(a).not.equal(b);
});

test("newShortRef uses only the safe alphabet, no ambiguous chars", () => {
  const ref = newShortRef();
  expect(ref).toHaveLength(8);
  expect(ref).toMatch(/^[2-9A-HJ-NP-Z]+$/);
});

test("isValidId rejects non-strings and empty strings", () => {
  expect(isValidId("abc")).toBe(true);
  expect(isValidId("")).toBe(false);
  expect(isValidId(null)).toBe(false);
  expect(isValidId(42)).toBe(false);
});