// js/task.ts — Task model (→ id, validate)
// Sits in the middle of the dependency chain: consumes the HOT id
// module and the zod-backed validator, and is itself consumed by
// filter.js and board.js.

import { newId, newShortRef } from "./id.js";
import { validateTaskInput } from "./validate.js";

export type TaskStatus = "open" | "done";

export interface Task {
  id: string;
  ref: string;
  title: string;
  notes: string;
  priority: string;
  dueDate: string | null;
  columnId: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export const STATUSES: string[] = ["open", "done"];

export function createTask(rawInput: Record<string, unknown>): Task {
  const result = validateTaskInput(rawInput);
  if (!result.success) {
    throw new Error(`Cannot create task: ${result.error}`);
  }

  const data = result.data;
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

export function isOverdue(task: Task, referenceDate: Date = new Date()): boolean {
  if (!task.dueDate || task.status === "done") return false;
  return new Date(task.dueDate) < referenceDate;
}