import { test, expect } from "vitest";
import {
  formatDueDate,
  dueDateStatus,
  relativeDueDate,
} from "../js/format";

test("formatDueDate returns a placeholder when no date is given", () => {
  expect(formatDueDate(null)).toBe("No due date");
  expect(formatDueDate(undefined)).toBe("No due date");
});

test("formatDueDate formats a real ISO string", () => {
  const label = formatDueDate("2026-01-15T09:30:00Z");
  expect(label).toMatch(/2026/);
  expect(label).toMatch(/Jan/);
});

test("dueDateStatus reports overdue for past dates", () => {
  expect(dueDateStatus("2000-01-01T00:00:00Z")).toBe("overdue");
});

test("dueDateStatus reports upcoming for future dates", () => {
  const future = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
  expect(dueDateStatus(future)).toBe("upcoming");
});

test("dueDateStatus reports none when no date is given", () => {
  expect(dueDateStatus(null)).toBe("none");
});

test("relativeDueDate includes a direction suffix", () => {
  const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString();
  const label = relativeDueDate(future);
  expect(label).toMatch(/from now/);
});