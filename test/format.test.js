import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatDueDate,
  dueDateStatus,
  relativeDueDate,
} from "../js/format.js";

test("formatDueDate returns a placeholder when no date is given", () => {
  assert.equal(formatDueDate(null), "No due date");
  assert.equal(formatDueDate(undefined), "No due date");
});

test("formatDueDate formats a real ISO string", () => {
  const label = formatDueDate("2026-01-15T09:30:00Z");
  assert.match(label, /2026/);
  assert.match(label, /Jan/);
});

test("dueDateStatus reports overdue for past dates", () => {
  assert.equal(dueDateStatus("2000-01-01T00:00:00Z"), "overdue");
});

test("dueDateStatus reports upcoming for future dates", () => {
  const future = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
  assert.equal(dueDateStatus(future), "upcoming");
});

test("dueDateStatus reports none when no date is given", () => {
  assert.equal(dueDateStatus(null), "none");
});

test("relativeDueDate includes a direction suffix", () => {
  const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString();
  const label = relativeDueDate(future);
  assert.match(label, /from now/);
});
