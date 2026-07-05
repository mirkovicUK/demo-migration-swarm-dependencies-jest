// js/board.ts — board/column state (→ task, filter, format, id)
// The widest fan-in module: pulls together the task model, filtering,
// formatting, and id generation (for columns) into one cohesive state
// object the app can render and mutate.

import { newId } from "./id.js";
import { createTask, completeTask, moveTask } from "./task.js";
import type { Task } from "./task.js";
import { byColumn, sortByDueDate } from "./filter.js";
import { formatDueDate, dueDateStatus } from "./format.js";

export interface Column {
  id: string;
  name: string;
}

export interface Board {
  columns: Column[];
  tasks: Task[];
}

export interface TaskView extends Task {
  dueDateLabel: string;
  dueDateStatus: string;
}

export function createBoard(columnNames: string[] = ["Backlog", "In Progress", "Done"]): Board {
  return {
    columns: columnNames.map((name) => ({ id: newId(), name })),
    tasks: [],
  };
}

export function addTask(board: Board, rawInput: unknown): Board {
  const task = createTask(rawInput);
  return { ...board, tasks: [...board.tasks, task] };
}

export function completeTaskById(board: Board, taskId: string): Board {
  return {
    ...board,
    tasks: board.tasks.map((t) => (t.id === taskId ? completeTask(t) : t)),
  };
}

export function moveTaskById(board: Board, taskId: string, targetColumnId: string): Board {
  return {
    ...board,
    tasks: board.tasks.map((t) =>
      t.id === taskId ? moveTask(t, targetColumnId) : t
    ),
  };
}

export function columnView(board: Board, columnId: string): TaskView[] {
  const tasksInColumn = sortByDueDate(byColumn(board.tasks, columnId));
  return tasksInColumn.map((task) => ({
    ...task,
    dueDateLabel: formatDueDate(task.dueDate),
    dueDateStatus: dueDateStatus(task.dueDate),
  }));
}