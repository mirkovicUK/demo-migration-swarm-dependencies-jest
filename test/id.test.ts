import { describe, it, expect } from 'vitest';
import { newId, newShortRef, isValidId } from '../js/id.js';

describe('newId', () => {
  it('returns a non-empty unique string', () => {
    const a = newId();
    const b = newId();
    expect(a.length > 0).toBe(true);
    expect(a).not.toBe(b);
  });
});

describe('newShortRef', () => {
  it('uses only the safe alphabet, no ambiguous chars', () => {
    const ref = newShortRef();
    expect(ref.length).toBe(8);
    expect(ref).toMatch(/^2-9A-HJ-NP-Z]+$/);
  });
});

describe('isValidId', () => {
  it('rejects non-strings and empty strings', () => {
    expect(isValidId("abc")).toBe(true);
    expect(isValidId("")).toBe(false);
    expect(isValidId(null)).toBe(false);
    expect(isValidId(42)).toBe(false);
  });
});