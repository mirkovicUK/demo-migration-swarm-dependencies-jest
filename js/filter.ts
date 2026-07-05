// js/filter.js — filter/search predicates over tasks (→ task)
import { Task } from './task';

export function byColumn(tasks: Task[], columnId: string): Task[] {
  return tasks.filter((task) => task.columnId === columnId);
}

export function byPriority(tasks: Task[], priority: string): Task[] {
  return tasks.filter((task) => task.priority === priority);
}

export function bySearchTerm(tasks: Task[], term: string): Task[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return tasks;
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(needle) ||
      task.notes.toLowerCase().includes(needle)
  );
}

export function openOnly(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === "open");
}

export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}