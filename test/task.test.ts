import { describe, it, expect } from 'vitest';
import { createTask, completeTask, moveTask, isOverdue } from '../js/task.js';

describe('createTask builds a task with a generated id and ref', () => {
  it('builds a task with a generated id and ref', () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    expect(task.id).toBeDefined();
    expect(task.ref).toBeDefined();
    expect(task.status).toBe("open");
    expect(task.columnId).toBe("col-1");
  });
});

describe('createTask throws with a readable message on invalid input', () => {
  it('throws with a readable message on invalid input', () => {
    expect(() => createTask({ columnId: "col-1" })).toThrow(/Cannot create task/);
  });
});

describe('completeTask marks status done and stamps completedAt', () => {
  it('marks status done and stamps completedAt', () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    const done = completeTask(task);
    expect(done.status).toBe("done");
    expect(done.completedAt).toBeDefined();
    // original is untouched (immutability)
    expect(task.status).toBe("open");
  });
});

describe('moveTask changes columnId without mutating the original', () => {
  it('changes columnId without mutating the original', () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    const moved = moveTask(task, "col-2");
    expect(moved.columnId).toBe("col-2");
    expect(task.columnId).toBe("col-1");
  });
});

describe('moveTask requires a target column', () => {
  it('requires a target column', () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    expect(() => moveTask(task, "")).toThrow(/targetColumnId/);
  });
});

describe('isOverdue is false for tasks with no due date', () => {
  it('is false for tasks with no due date', () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    expect(isOverdue(task)).toBe(false);
  });
});

describe('isOverdue is false once a task is done, even if the date passed', () => {
  it('is false once a task is done, even if the date passed', () => {
    const task = createTask({
      title: "Ship it",
      columnId: "col-1",
      dueDate: "2000-01-01T00:00:00+00:00",
    });
    const done = completeTask(task);
    expect(isOverdue(done)).toBe(false);
  });
});

describe('isOverdue is true for a past due date on an open task', () => {
  it('is true for a past due date on an open task', () => {
    const task = createTask({
      title: "Ship it",
      columnId: "col-1",
      dueDate: "2000-01-01T00:00:00+00:00",
    });
    expect(isOverdue(task)).toBe(true);
  });
});