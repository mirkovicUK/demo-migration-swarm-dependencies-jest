import { test } from "node:test";
import assert from "node:assert/strict";
import { newId, newShortRef, isValidId } from "../js/id.js";

test("newId returns a non-empty unique string", () => {
  const a = newId();
  const b = newId();
  assert.ok(a.length > 0);
  assert.notEqual(a, b);
});

test("newShortRef uses only the safe alphabet, no ambiguous chars", () => {
  const ref = newShortRef();
  assert.equal(ref.length, 8);
  assert.match(ref, /^[2-9A-HJ-NP-Z]+$/);
});

test("isValidId rejects non-strings and empty strings", () => {
  assert.equal(isValidId("abc"), true);
  assert.equal(isValidId(""), false);
  assert.equal(isValidId(null), false);
  assert.equal(isValidId(42), false);
});
