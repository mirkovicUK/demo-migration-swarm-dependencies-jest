// js/index.js — re-export barrel (→ everything)
// Mirrors the first demo's barrel pattern: storage.js reaches the
// rest of the app through this single entry point via a dynamic
// import(), rather than importing each module directly.

export * from "./id.js";
export * from "./validate.js";
export * from "./format.js";
export * from "./task.js";
export * from "./filter.js";
export * from "./board.js";
