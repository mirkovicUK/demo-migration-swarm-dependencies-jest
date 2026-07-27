// js/format.js — formatting via the real npm dependency `date-fns`.
// A second, independent library (separate from id.js's nanoid and
// validate.js's zod) so the dependency-aware scaffold has more than
// one real package to resolve, install, and keep resolvable across
// the whole rewritten project.

import { format, formatDistanceToNowStrict, isPast, parseISO } from "date-fns";

export function formatDueDate(isoString: string | undefined): string {
  if (!isoString) return "No due date";
  const date = parseISO(isoString);
  return format(date, "EEE, MMM d yyyy 'at' HH:mm");
}

export function dueDateStatus(isoString: string | undefined): string {
  if (!isoString) return "none";
  const date = parseISO(isoString);
  if (isPast(date)) return "overdue";
  return "upcoming";
}

export function relativeDueDate(isoString: string | undefined): string {
  if (!isoString) return "";
  const date = parseISO(isoString);
  const suffix = isPast(date) ? "ago" : "from now";
  return `${formatDistanceToNowStrict(date)} ${suffix}`;
}