// js/validate.js — validation via the real npm dependency `zod`.
// Deliberately the module most worth watching post-migration: zod's
// inferred-type ergonomics (z.infer<typeof Schema>) only exist in TS,
// so this file goes from "runtime-checked plain objects" in JS to
// "a schema that also drives static types" in TS — a realistic,
// non-trivial type-surface change for the migration engine to produce
// correctly and for downstream files (task.js) to consume consistently.

import { z } from "zod";

export const PRIORITIES = ["low", "medium", "high"];

export const TaskInputSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(120),
  notes: z.string().trim().max(2000).optional().default(""),
  priority: z.enum(PRIORITIES).default("medium"),
  dueDate: z.string().datetime({ offset: true }).optional(),
  columnId: z.string().min(1, "columnId is required"),
});

// Returns { success, data } or { success: false, error } — mirrors
// zod's own `safeParse` shape so callers don't need to know it's zod.
export function validateTaskInput(raw) {
  const result = TaskInputSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: formatZodError(result.error) };
  }
  return { success: true, data: result.data };
}

function formatZodError(zodError) {
  return zodError.issues
    .map((issue) => `${issue.path.join(".") || "(value)"}: ${issue.message}`)
    .join("; ");
}
