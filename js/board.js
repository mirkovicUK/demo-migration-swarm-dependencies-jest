// js/board.js — board/column state (→ task, filter, format, id)
// The widest fan-in module: pulls together the task model, filtering,
// formatting, and id generation (for columns) into one cohesive state
// object the app can render and mutate.

import { newId } from "./id.js";
import { createTask, completeTask, moveTask } from "./task.js";
import { byColumn, sortByDueDate } from "./filter.js";
import { formatDueDate, dueDateStatus } from "./format.js";

export function createBoard(columnNames = ["Backlog", "In Progress", "Done"]) {
  return {
    columns: columnNames.map((name) => ({ id: newId(), name })),
    tasks: [],
  };
}

export function addTask(board, rawInput) {
  const task = createTask(rawInput);
  return { ...board, tasks: [...board.tasks, task] };
}

export function completeTaskById(board, taskId) {
  return {
    ...board,
    tasks: board.tasks.map((t) => (t.id === taskId ? completeTask(t) : t)),
  };
}

export function moveTaskById(board, taskId, targetColumnId) {
  return {
    ...board,
    tasks: board.tasks.map((t) =>
      t.id === taskId ? moveTask(t, targetColumnId) : t
    ),
  };
}

export function columnView(board, columnId) {
  const tasksInColumn = sortByDueDate(byColumn(board.tasks, columnId));
  return tasksInColumn.map((task) => ({
    ...task,
    dueDateLabel: formatDueDate(task.dueDate),
    dueDateStatus: dueDateStatus(task.dueDate),
  }));
}
