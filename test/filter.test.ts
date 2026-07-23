// test/filter.test.ts — Vitest (ESM).
import { describe, it, expect } from "vitest";
import {
  byColumn,
  byPriority,
  bySearchTerm,
  openOnly,
  sortByDueDate,
} from "../js/filter.js";
import { createTask, completeTask } from "../js/task.js";

function sampleTasks() {
  return [
    createTask({ title: "Write README", columnId: "col-1", priority: "low" }),
    createTask({
      title: "Fix crash on login",
      notes: "affects prod",
      columnId: "col-2",
      priority: "high",
      dueDate: "2026-01-01T00:00:00+00:00",
    }),
    createTask({
      title: "Refactor board.js",
      columnId: "col-1",
      priority: "medium",
      dueDate: "2025-01-01T00:00:00+00:00",
    }),
  ];
}

describe("filter", () => {
  it("byColumn returns only tasks in the given column", () => {
    const inCol1 = byColumn(sampleTasks(), "col-1");
    expect(inCol1).toHaveLength(2);
    expect(inCol1.every((t) => t.columnId === "col-1")).toBe(true);
  });

  it("byPriority filters by exact priority", () => {
    const high = byPriority(sampleTasks(), "high");
    expect(high).toHaveLength(1);
    expect(high[0].title).toBe("Fix crash on login");
  });

  it("bySearchTerm matches title or notes, case-insensitively", () => {
    const tasks = sampleTasks();
    expect(bySearchTerm(tasks, "readme")).toHaveLength(1);
    expect(bySearchTerm(tasks, "PROD")).toHaveLength(1);
    expect(bySearchTerm(tasks, "")).toHaveLength(tasks.length);
  });

  it("openOnly excludes completed tasks", () => {
    const tasks = sampleTasks();
    const withOneDone = [completeTask(tasks[0]), tasks[1], tasks[2]];
    expect(openOnly(withOneDone)).toHaveLength(2);
  });

  it("sortByDueDate puts tasks without a due date last", () => {
    const sorted = sortByDueDate(sampleTasks());
    const last = sorted.at(-1);
    const first = sorted[0];
    expect(last?.title).toBe("Write README");
    expect(first?.title).toBe("Refactor board.js");
  });
});