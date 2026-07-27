// js/task.ts — Task model (→ id, validate)
// Sits in the middle of the dependency chain: consumes the HOT id
// module and the zod-backed validator, and is itself consumed by
// filter.ts and board.ts.

import { newId, newShortRef } from "./id.js";
import { validateTaskInput } from "./validate.js";

export const STATUSES = ["open", "done"] as const;

export function createTask(rawInput: any) {
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

export function completeTask(task: any) {
  return { ...task, status: "done", completedAt: new Date().toISOString() };
}

export function moveTask(task: any, targetColumnId: string) {
  if (!targetColumnId) {
    throw new Error("moveTask requires a targetColumnId");
  }
  return { ...task, columnId: targetColumnId };
}

export function isOverdue(task: any, referenceDate: Date = new Date()) {
  if (!task.dueDate || task.status === "done") return false;
  return new Date(task.dueDate) < referenceDate;
}