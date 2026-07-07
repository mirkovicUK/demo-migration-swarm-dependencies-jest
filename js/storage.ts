// js/storage.ts — localStorage persistence + dynamic import (→ index barrel)
// Same pattern as the first demo: reaches the app's functions through
// a dynamic import() of the barrel rather than static imports, so the
// migration engine's import-graph parser has to handle a dynamic
// specifier here as well as the static ones everywhere else.

const STORAGE_KEY = "task-board:v1";

export function loadBoard(): unknown | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveBoard(board: unknown): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export async function loadOrCreateBoard(): Promise<unknown> {
  const existing = loadBoard();
  if (existing) return existing;

  const { createBoard } = await import("./index.js");
  const board = createBoard();
  saveBoard(board);
  return board;
}