// test/board.test.js — Jest (ESM).
import { describe, it, expect } from "@jest/globals";
import {
  createBoard,
  addTask,
  completeTaskById,
  moveTaskById,
  columnView,
} from "../js/board.js";

describe("board", () => {
  it("createBoard sets up default columns with generated ids", () => {
    const board = createBoard();
    expect(board.columns).toHaveLength(3);
    expect(board.columns[0].name).toBe("Backlog");
    expect(board.columns.every((c) => c.id)).toBe(true);
    expect(board.tasks).toHaveLength(0);
  });

  it("addTask appends a validated task to the board", () => {
    const board = createBoard();
    const columnId = board.columns[0].id;
    const updated = addTask(board, { title: "Plan sprint", columnId });
    expect(updated.tasks).toHaveLength(1);
    expect(updated.tasks[0].title).toBe("Plan sprint");
    // original board is untouched
    expect(board.tasks).toHaveLength(0);
  });

  it("moveTaskById moves a task between columns", () => {
    let board = createBoard();
    const [backlog, inProgress] = board.columns;
    board = addTask(board, { title: "Design schema", columnId: backlog.id });
    const taskId = board.tasks[0].id;

    const moved = moveTaskById(board, taskId, inProgress.id);
    expect(moved.tasks[0].columnId).toBe(inProgress.id);
  });

  it("completeTaskById marks the right task done, leaves others open", () => {
    let board = createBoard();
    const columnId = board.columns[0].id;
    board = addTask(board, { title: "Task A", columnId });
    board = addTask(board, { title: "Task B", columnId });
    const targetId = board.tasks[0].id;

    const updated = completeTaskById(board, targetId);
    expect(updated.tasks[0].status).toBe("done");
    expect(updated.tasks[1].status).toBe("open");
  });

  it("columnView returns only that column's tasks, sorted, with due labels", () => {
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
    expect(view).toHaveLength(2);
    expect(view[0].title).toBe("Sooner task");
    expect(view[0].dueDateLabel).toContain("2026");
    expect(view[0]).toHaveProperty("dueDateStatus");
  });
});
