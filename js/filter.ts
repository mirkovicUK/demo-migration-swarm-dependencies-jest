// js/filter.ts — filter/search predicates over tasks (→ task)

export function byColumn(tasks: any[], columnId: string): any[] {
  return tasks.filter((task) => task.columnId === columnId);
}

export function byPriority(tasks: any[], priority: string): any[] {
  return tasks.filter((task) => task.priority === priority);
}

export function bySearchTerm(tasks: any[], term: string): any[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return tasks;
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(needle) ||
      task.notes.toLowerCase().includes(needle)
  );
}

export function openOnly(tasks: any[]): any[] {
  return tasks.filter((task) => task.status === "open");
}

export function sortByDueDate(tasks: any[]): any[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}