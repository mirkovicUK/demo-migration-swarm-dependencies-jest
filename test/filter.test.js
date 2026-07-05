import { test } from "node:test";
import assert from "node:assert/strict";
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

test("byColumn returns only tasks in the given column", () => {
  const tasks = sampleTasks();
  const inCol1 = byColumn(tasks, "col-1");
  assert.equal(inCol1.length, 2);
  assert.ok(inCol1.every((t) => t.columnId === "col-1"));
});

test("byPriority filters by exact priority", () => {
  const tasks = sampleTasks();
  const high = byPriority(tasks, "high");
  assert.equal(high.length, 1);
  assert.equal(high[0].title, "Fix crash on login");
});

test("bySearchTerm matches title or notes, case-insensitively", () => {
  const tasks = sampleTasks();
  assert.equal(bySearchTerm(tasks, "readme").length, 1);
  assert.equal(bySearchTerm(tasks, "PROD").length, 1);
  assert.equal(bySearchTerm(tasks, "").length, tasks.length);
});

test("openOnly excludes completed tasks", () => {
  const tasks = sampleTasks();
  const withOneDone = [completeTask(tasks[0]), tasks[1], tasks[2]];
  const open = openOnly(withOneDone);
  assert.equal(open.length, 2);
});

test("sortByDueDate puts tasks without a due date last", () => {
  const tasks = sampleTasks();
  const sorted = sortByDueDate(tasks);
  assert.equal(sorted.at(-1).title, "Write README");
  assert.equal(sorted[0].title, "Refactor board.js");
});
