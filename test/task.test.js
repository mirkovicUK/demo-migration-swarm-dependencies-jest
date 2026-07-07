// test/task.test.js — Jest (ESM).
import { describe, it, expect } from "@jest/globals";
import { createTask, completeTask, moveTask, isOverdue } from "../js/task.js";

describe("task", () => {
  it("createTask builds a task with a generated id and ref", () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    expect(task.id).toBeTruthy();
    expect(task.ref).toBeTruthy();
    expect(task.status).toBe("open");
    expect(task.columnId).toBe("col-1");
  });

  it("createTask throws with a readable message on invalid input", () => {
    expect(() => createTask({ columnId: "col-1" })).toThrow(/Cannot create task/);
  });

  it("completeTask marks status done and stamps completedAt", () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    const done = completeTask(task);
    expect(done.status).toBe("done");
    expect(done.completedAt).toBeTruthy();
    // original is untouched (immutability)
    expect(task.status).toBe("open");
  });

  it("moveTask changes columnId without mutating the original", () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    const moved = moveTask(task, "col-2");
    expect(moved.columnId).toBe("col-2");
    expect(task.columnId).toBe("col-1");
  });

  it("moveTask requires a target column", () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    expect(() => moveTask(task, "")).toThrow(/targetColumnId/);
  });

  it("isOverdue is false for tasks with no due date", () => {
    const task = createTask({ title: "Ship it", columnId: "col-1" });
    expect(isOverdue(task)).toBe(false);
  });

  it("isOverdue is false once a task is done, even if the date passed", () => {
    const task = createTask({
      title: "Ship it",
      columnId: "col-1",
      dueDate: "2000-01-01T00:00:00+00:00",
    });
    expect(isOverdue(completeTask(task))).toBe(false);
  });

  it("isOverdue is true for a past due date on an open task", () => {
    const task = createTask({
      title: "Ship it",
      columnId: "col-1",
      dueDate: "2000-01-01T00:00:00+00:00",
    });
    expect(isOverdue(task)).toBe(true);
  });
});
