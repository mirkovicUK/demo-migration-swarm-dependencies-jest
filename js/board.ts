// js/board.ts — board/column state (→ task, filter, format, id)
// The widest fan-in module: pulls together the task model, filtering,
// formatting, and id generation (for columns) into one cohesive state
// object the app can render and mutate.

import { newId } from "./id.js";
import { createTask, completeTask, moveTask } from "./task.js";
import { byColumn, sortByDueDate } from "./filter.js";
import { formatDueDate, dueDateStatus } from "./format.js";

export function createBoard(columnNames: string[] = ["Backlog", "In Progress", "Done"]) {
  return {
    columns: columnNames.map((name) => ({ id: newId(), name })),
    tasks: [],
  };
}

export function addTask(board: any, rawInput: any) {
  const task = createTask(rawInput);
  return { ...board, tasks: [...board.tasks, task] };
}

export function completeTaskById(board: any, taskId: string) {
  return {
    ...board,
    tasks: board.tasks.map((t: any) => (t.id === taskId ? completeTask(t) : t)),
  };
}

export function moveTaskById(board: any, taskId: string, targetColumnId: string) {
  return {
    ...board,
    tasks: board.tasks.map((t: any) =>
      t.id === taskId ? moveTask(t, targetColumnId) : t
    ),
  };
}

export function columnView(board: any, columnId: string) {
  const tasksInColumn = sortByDueDate(byColumn(board.tasks, columnId));
  return tasksInColumn.map((task: any) => ({
    ...task,
    dueDateLabel: formatDueDate(task.dueDate),
    dueDateStatus: dueDateStatus(task.dueDate),
  }));
}