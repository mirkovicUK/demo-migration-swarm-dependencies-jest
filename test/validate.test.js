import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTaskInput } from "../js/validate.js";

test("accepts a minimal valid task", () => {
  const result = validateTaskInput({ title: "Write tests", columnId: "col-1" });
  assert.equal(result.success, true);
  assert.equal(result.data.title, "Write tests");
  assert.equal(result.data.priority, "medium");
  assert.equal(result.data.notes, "");
});

test("rejects a missing title", () => {
  const result = validateTaskInput({ columnId: "col-1" });
  assert.equal(result.success, false);
  assert.match(result.error, /title/);
});

test("rejects an invalid priority", () => {
  const result = validateTaskInput({
    title: "x",
    columnId: "col-1",
    priority: "urgent",
  });
  assert.equal(result.success, false);
});

test("rejects a malformed dueDate", () => {
  const result = validateTaskInput({
    title: "x",
    columnId: "col-1",
    dueDate: "not-a-date",
  });
  assert.equal(result.success, false);
});

test("accepts a valid ISO dueDate with offset", () => {
  const result = validateTaskInput({
    title: "x",
    columnId: "col-1",
    dueDate: "2026-08-01T10:00:00+00:00",
  });
  assert.equal(result.success, true);
});
