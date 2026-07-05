// js/task.ts — Task model (→ id, validate)
// Sits in the middle of the dependency chain: consumes the HOT id
// module and the zod-backed validator, and is itself consumed by
// filter.ts and board.ts.

import { newId, newShortRef } from "./id.js";
import { validateTaskInput } from "./validate.js";
import { TaskInput } from "./task.js";

export const STATUSES = ["open", "done"] as const;

export type TaskStatus = (typeof STATUSES)[number];
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  ref: string;
  title: string;
  notes: string;
  priority: TaskPriority;
  dueDate: string | null;
  columnId: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export function createTask(rawInput: TaskInput): Task {
  const { success, data, error } = validateTaskInput(rawInput);
  if (!success) {
    throw new Error(`Cannot create task: ${error}`);
  }

  return {
    id: newId(),
    ref: newShortRef(),
    title: data.title,
    notes: data.notes,
    priority: data.priority,
    dueDate: data.dueDate ?? null,
    columnId: data.columnId,
    status: "open",
    createdAt: new Date().toISOString(),
  };
}

export function completeTask(task: Task): Task {
  return { ...task, status: "done", completedAt: new Date().toISOString() };
}

export function moveTask(task: Task, targetColumnId: string): Task {
  if (!targetColumnId) {
    throw new Error("moveTask requires a targetColumnId");
  }
  return { ...task, columnId: targetColumnId };
}

export function isOverdue(
  task: Task,
  referenceDate: Date = new Date()
): boolean {
  if (!task.dueDate || task.status === "done") return false;
  return new Date(task.dueDate) < referenceDate;
}