import { test, expect } from "vitest";
import { createTask, completeTask, moveTask, isOverdue } from "../js/task";
import type { TaskInput } from "../js/task";

test("createTask builds a task with a generated id and ref", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" } as TaskInput);
  expect(task.id).toBeTruthy();
  expect(task.ref).toBeTruthy();
  expect(task.status).toBe("open");
  expect(task.columnId).toBe("col-1");
});

test("createTask throws with a readable message on invalid input", () => {
  expect(() => createTask({ columnId: "col-1" } as TaskInput)).toThrow(/Cannot create task/);
});

test("completeTask marks status done and stamps completedAt", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" } as TaskInput);
  const done = completeTask(task);
  expect(done.status).toBe("done");
  expect(done.completedAt).toBeTruthy();
  // original is untouched (immutability)
  expect(task.status).toBe("open");
});

test("moveTask changes columnId without mutating the original", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" } as TaskInput);
  const moved = moveTask(task, "col-2");
  expect(moved.columnId).toBe("col-2");
  expect(task.columnId).toBe("col-1");
});

test("moveTask requires a target column", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" } as TaskInput);
  expect(() => moveTask(task, "")).toThrow(/targetColumnId/);
});

test("isOverdue is false for tasks with no due date", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" } as TaskInput);
  expect(isOverdue(task)).toBe(false);
});

test("isOverdue is false once a task is done, even if the date passed", () => {
  const task = createTask({
    title: "Ship it",
    columnId: "col-1",
    dueDate: "2000-01-01T00:00:00+00:00",
  } as TaskInput);
  const done = completeTask(task);
  expect(isOverdue(done)).toBe(false);
});

test("isOverdue is true for a past due date on an open task", () => {
  const task = createTask({
    title: "Ship it",
    columnId: "col-1",
    dueDate: "2000-01-01T00:00:00+00:00",
  } as TaskInput);
  expect(isOverdue(task)).toBe(true);
});