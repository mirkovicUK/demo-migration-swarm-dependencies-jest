import { z } from "zod";
import type { Task } from './task.js';

export const PRIORITIES = ["low", "medium", "high"] as const;

export const TaskInputSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(120),
  notes: z.string().trim().max(2000).optional().default(""),
  priority: z.enum(PRIORITIES).default("medium"),
  dueDate: z.string().datetime({ offset: true }).optional(),
  columnId: z.string().min(1, "columnId is required"),
});

export type TaskInput = z.infer<typeof TaskInputSchema>;

export interface ValidateSuccess {
  success: true;
  data: TaskInput;
}

export interface ValidateFailure {
  success: false;
  error: string;
}

export type ValidateResult = ValidateSuccess | ValidateFailure;

export function validateTaskInput(raw: unknown): ValidateResult {
  const result = TaskInputSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: formatZodError(result.error) };
  }
  return { success: true, data: result.data };
}

function formatZodError(zodError: z.ZodError): string {
  return zodError.issues
    .map((issue) => `${issue.path.join(".") || "(value)"}: ${issue.message}`)
    .join("; ");
}