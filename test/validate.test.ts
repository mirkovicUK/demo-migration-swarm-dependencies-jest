import { test, expect } from "vitest";
import { validateTaskInput } from "../js/validate.js";
import type { ValidateSuccess, ValidateFailure } from "../js/validate.js";

test("accepts a minimal valid task", () => {
  const result = validateTaskInput({ title: "Write tests", columnId: "col-1" });
  expect(result.success).toBe(true);
  if (result.success) {
    const success = result as ValidateSuccess;
    expect(success.data.title).toBe("Write tests");
    expect(success.data.priority).toBe("medium");
    expect(success.data.notes).toBe("");
  }
});

test("rejects a missing title", () => {
  const result = validateTaskInput({ columnId: "col-1" });
  expect(result.success).toBe(false);
  if (!result.success) {
    const failure = result as ValidateFailure;
    expect(failure.error).toMatch(/title/);
  }
});

test("rejects an invalid priority", () => {
  const result = validateTaskInput({
    title: "x",
    columnId: "col-1",
    priority: "urgent",
  });
  expect(result.success).toBe(false);
});

test("rejects a malformed dueDate", () => {
  const result = validateTaskInput({
    title: "x",
    columnId: "col-1",
    dueDate: "not-a-date",
  });
  expect(result.success).toBe(false);
});

test("accepts a valid ISO dueDate with offset", () => {
  const result = validateTaskInput({
    title: "x",
    columnId: "col-1",
    dueDate: "2026-08-01T10:00:00+00:00",
  });
  expect(result.success).toBe(true);
});