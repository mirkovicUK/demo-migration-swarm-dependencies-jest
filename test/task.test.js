import { test } from "node:test";
import assert from "node:assert/strict";
import { createTask, completeTask, moveTask, isOverdue } from "../js/task.js";

test("createTask builds a task with a generated id and ref", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" });
  assert.ok(task.id);
  assert.ok(task.ref);
  assert.equal(task.status, "open");
  assert.equal(task.columnId, "col-1");
});

test("createTask throws with a readable message on invalid input", () => {
  assert.throws(
    () => createTask({ columnId: "col-1" }),
    /Cannot create task/
  );
});

test("completeTask marks status done and stamps completedAt", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" });
  const done = completeTask(task);
  assert.equal(done.status, "done");
  assert.ok(done.completedAt);
  // original is untouched (immutability)
  assert.equal(task.status, "open");
});

test("moveTask changes columnId without mutating the original", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" });
  const moved = moveTask(task, "col-2");
  assert.equal(moved.columnId, "col-2");
  assert.equal(task.columnId, "col-1");
});

test("moveTask requires a target column", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" });
  assert.throws(() => moveTask(task, ""), /targetColumnId/);
});

test("isOverdue is false for tasks with no due date", () => {
  const task = createTask({ title: "Ship it", columnId: "col-1" });
  assert.equal(isOverdue(task), false);
});

test("isOverdue is false once a task is done, even if the date passed", () => {
  const task = createTask({
    title: "Ship it",
    columnId: "col-1",
    dueDate: "2000-01-01T00:00:00+00:00",
  });
  const done = completeTask(task);
  assert.equal(isOverdue(done), false);
});

test("isOverdue is true for a past due date on an open task", () => {
  const task = createTask({
    title: "Ship it",
    columnId: "col-1",
    dueDate: "2000-01-01T00:00:00+00:00",
  });
  assert.equal(isOverdue(task), true);
});
