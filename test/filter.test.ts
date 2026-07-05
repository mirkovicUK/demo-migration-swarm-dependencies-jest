import { describe, it, expect } from 'vitest';
import {
  byColumn,
  byPriority,
  bySearchTerm,
  openOnly,
  sortByDueDate,
} from '../js/filter.js';
import { createTask, completeTask } from '../js/task.js';

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

describe('byColumn returns only tasks in the given column', () => {
  it('filters tasks by column id', () => {
    const tasks = sampleTasks();
    const inCol1 = byColumn(tasks, "col-1");
    expect(inCol1.length).toBe(2);
    expect(inCol1.every((t) => t.columnId === "col-1")).toBe(true);
  });
});

describe('byPriority filters by exact priority', () => {
  it('filters tasks by priority', () => {
    const tasks = sampleTasks();
    const high = byPriority(tasks, "high");
    expect(high.length).toBe(1);
    expect(high[0].title).toBe("Fix crash on login");
  });
});

describe('bySearchTerm matches title or notes, case-insensitively', () => {
  it('matches title or notes case-insensitively', () => {
    const tasks = sampleTasks();
    expect(bySearchTerm(tasks, "readme").length).toBe(1);
    expect(bySearchTerm(tasks, "PROD").length).toBe(1);
    expect(bySearchTerm(tasks, "").length).toBe(tasks.length);
  });
});

describe('openOnly excludes completed tasks', () => {
  it('filters out completed tasks', () => {
    const tasks = sampleTasks();
    const withOneDone = [completeTask(tasks[0]), tasks[1], tasks[2]];
    const open = openOnly(withOneDone);
    expect(open.length).toBe(2);
  });
});

describe('sortByDueDate puts tasks without a due date last', () => {
  it('sorts tasks by due date, putting undated tasks last', () => {
    const tasks = sampleTasks();
    const sorted = sortByDueDate(tasks);
    expect(sorted.at(-1)?.title).toBe("Write README");
    expect(sorted[0].title).toBe("Refactor board.js");
  });
});