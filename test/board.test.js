import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createBoard,
  addTask,
  completeTaskById,
  moveTaskById,
  columnView,
} from "../js/board.js";

test("createBoard sets up default columns with generated ids", () => {
  const board = createBoard();
  assert.equal(board.columns.length, 3);
  assert.equal(board.columns[0].name, "Backlog");
  assert.ok(board.columns.every((c) => c.id));
  assert.equal(board.tasks.length, 0);
});

test("addTask appends a validated task to the board", () => {
  const board = createBoard();
  const columnId = board.columns[0].id;
  const updated = addTask(board, { title: "Plan sprint", columnId });
  assert.equal(updated.tasks.length, 1);
  assert.equal(updated.tasks[0].title, "Plan sprint");
  // original board is untouched
  assert.equal(board.tasks.length, 0);
});

test("moveTaskById moves a task between columns", () => {
  let board = createBoard();
  const [backlog, inProgress] = board.columns;
  board = addTask(board, { title: "Design schema", columnId: backlog.id });
  const taskId = board.tasks[0].id;

  const moved = moveTaskById(board, taskId, inProgress.id);
  assert.equal(moved.tasks[0].columnId, inProgress.id);
});

test("completeTaskById marks the right task done, leaves others open", () => {
  let board = createBoard();
  const columnId = board.columns[0].id;
  board = addTask(board, { title: "Task A", columnId });
  board = addTask(board, { title: "Task B", columnId });
  const targetId = board.tasks[0].id;

  const updated = completeTaskById(board, targetId);
  assert.equal(updated.tasks[0].status, "done");
  assert.equal(updated.tasks[1].status, "open");
});

test("columnView returns only that column's tasks, sorted, with due labels", () => {
  let board = createBoard();
  const columnId = board.columns[0].id;
  board = addTask(board, {
    title: "Later task",
    columnId,
    dueDate: "2026-06-01T00:00:00+00:00",
  });
  board = addTask(board, {
    title: "Sooner task",
    columnId,
    dueDate: "2026-01-01T00:00:00+00:00",
  });

  const view = columnView(board, columnId);
  assert.equal(view.length, 2);
  assert.equal(view[0].title, "Sooner task");
  assert.ok(view[0].dueDateLabel.includes("2026"));
  assert.ok("dueDateStatus" in view[0]);
});
