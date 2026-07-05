// js/filter.js — filter/search predicates over tasks (→ task)

export function byColumn(tasks, columnId) {
  return tasks.filter((task) => task.columnId === columnId);
}

export function byPriority(tasks, priority) {
  return tasks.filter((task) => task.priority === priority);
}

export function bySearchTerm(tasks, term) {
  const needle = term.trim().toLowerCase();
  if (!needle) return tasks;
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(needle) ||
      task.notes.toLowerCase().includes(needle)
  );
}

export function openOnly(tasks) {
  return tasks.filter((task) => task.status === "open");
}

export function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
}
