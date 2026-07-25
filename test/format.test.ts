// test/format.test.ts — Vitest (ESM). Uses Vitest fake timers (vi.useFakeTimers etc.).
import { describe, it, expect, vi, afterEach } from "vitest";
import { formatDueDate, dueDateStatus, relativeDueDate } from "../js/format.js";

describe("format", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("formatDueDate returns a placeholder when no date is given", () => {
    expect(formatDueDate(null)).toBe("No due date");
    expect(formatDueDate(undefined)).toBe("No due date");
  });

  it("formatDueDate formats a real ISO string", () => {
    const label = formatDueDate("2026-01-15T09:30:00Z");
    expect(label).toMatch(/2026/);
    expect(label).toMatch(/Jan/);
  });

  it("dueDateStatus reports overdue for past dates", () => {
    expect(dueDateStatus("2000-01-01T00:00:00Z")).toBe("overdue");
  });

  it("dueDateStatus reports upcoming for a future date (fake clock)", () => {
    // Freeze "now" so the future date is deterministic (Vitest fake timers).
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    expect(dueDateStatus("2025-06-01T00:00:00Z")).toBe("upcoming");
  });

  it("dueDateStatus reports none when no date is given", () => {
    expect(dueDateStatus(null)).toBe("none");
  });

  it("relativeDueDate includes a direction suffix (fake clock)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    expect(relativeDueDate("2025-01-04T00:00:00Z")).toMatch(/from now/);
  });
});