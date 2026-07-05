// js/id.js — HOT ⭐
// Thin wrapper around the real npm dependency `nanoid`.
// Every model in this app (Task, Column) gets its identity from here,
// so this file is imported almost everywhere — same role money.js
// played in the first demo, but backed by a real third-party package
// instead of hand-rolled logic.

import { nanoid, customAlphabet } from "nanoid";

// Short, URL-safe, unambiguous ids for user-facing task references
// (no 0/O/1/l confusion when someone reads a task id out loud).
const SAFE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const shortId = customAlphabet(SAFE_ALPHABET, 8);

export function newId() {
  return nanoid();
}

export function newShortRef() {
  return shortId();
}

export function isValidId(value) {
  return typeof value === "string" && value.length > 0;
}
