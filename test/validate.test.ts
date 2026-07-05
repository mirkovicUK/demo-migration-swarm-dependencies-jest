import { describe, it, expect } from 'vitest';
import { validateTaskInput } from '../js/validate.js';

describe('accepts a minimal valid task', () => {
  it('accepts a minimal valid task', () => {
    const result = validateTaskInput({ title: "Write tests", columnId: "col-1" });
    expect(result.success).toBe(true);
    expect(result.data.title).toBe("Write tests");
    expect(result.data.priority).toBe("medium");
    expect(result.data.notes).toBe("");
  });
});

describe('rejects a missing title', () => {
  it('rejects a missing title', () => {
    const result = validateTaskInput({ columnId: "col-1" });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/title/);
  });
});

describe('rejects an invalid priority', () => {
  it('rejects an invalid priority', () => {
    const result = validateTaskInput({
      title: "x",
      columnId: "col-1",
      priority: "urgent",
    });
    expect(result.success).toBe(false);
  });
});

describe('rejects a malformed dueDate', () => {
  it('rejects a malformed dueDate', () => {
    const result = validateTaskInput({
      title: "x",
      columnId: "col-1",
      dueDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});

describe('accepts a valid ISO dueDate with offset', () => {
  it('accepts a valid ISO dueDate with offset', () => {
    const result = validateTaskInput({
      title: "x",
      columnId: "col-1",
      dueDate: "2026-08-01T10:00:00+00:00",
    });
    expect(result.success).toBe(true);
  });
});