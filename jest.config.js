// jest.config.js — Jest config for this ESM project.
//
// This file is ALSO a migration fixture: it is on the scaffold's
// non-migratable skip list, so a migration must NOT rewrite it into
// `jest.config.ts` — the migrated project runs on Vitest, which the scaffold
// generates its own config for. `transform: {}` keeps ESM as ESM (no Babel),
// so the ESM-only deps (nanoid/zod/date-fns) import natively under
// `node --experimental-vm-modules`.
export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/test/**/*.test.js"],
};
