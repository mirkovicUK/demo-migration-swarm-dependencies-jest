# demo-migration-swarm-dependencies-jest

Fixed demo repository (vanilla HTML/CSS/JS, three real npm dependencies) for
validating Migration Swarm's **dependency-aware scaffold** — this variant adds
a **Jest** test suite so it also exercises the migrator's **Jest → Vitest test
migration**.

It has the same architecture and dependencies as `demo-migration-swarm-deps`
(a hot shared module, a real dependency chain, a barrel, a dynamic import, path
aliases, asset imports, and excluded `vendor/`+`build/` dirs). The only
difference is the test tooling: instead of `node:test`, the tests are written
for **Jest** (`@jest/globals`, `describe`/`it`/`expect`, and Jest fake timers).

## What the Jest layer adds to the test matrix

| Scenario | Where | Expected migration behavior |
|---|---|---|
| Jest test files | `test/*.test.js` (import from `@jest/globals`) | rewritten to the **Vitest** API (`import { … } from 'vitest'`, `describe`/`it`/`expect`) |
| Jest-specific mocks / fake timers | `test/format.test.js` (`jest.useFakeTimers`, `jest.setSystemTime`, `jest.useRealTimers`) | converted to `vi.useFakeTimers` / `vi.setSystemTime` / `vi.useRealTimers` |
| `@jest/globals` import | every test file | **never** added to the generated `package.json` dependencies (test-framework denylist) |
| Jest config | `jest.config.js` | on the non-migratable skip list → **never** migrated to `jest.config.ts`; the scaffold emits its own Vitest/Vite config instead |
| `jest` devDependency | `package.json` | dropped from the generated runtime dependencies; the scaffold provides `vitest` instead |

The dependency-aware-scaffold coverage (three real deps at pinned versions,
`node:` builtin exclusion, subpath normalization, path aliases, asset shims,
`vendor/`+`build/` exclusion) is unchanged from `demo-migration-swarm-deps` —
see the modules in `js/` and the fixtures in `assets/`, `vendor/`, `build/`.

## Dependencies (real, pinned)

| Package     | Used in           | Role |
|-------------|--------------------|------|
| `nanoid`    | `js/id.js`         | HOT ⭐ id generation, imported nearly everywhere |
| `zod`       | `js/validate.js`   | runtime validation; `z.infer<…>` is a post-migration TS type surface |
| `date-fns`  | `js/format.js`     | due-date formatting; a second independent runtime dependency |

`jest` + `@jest/globals` are **devDependencies** (test tooling), so a correct
migration keeps them out of the migrated project's runtime `dependencies`.

## Run it

```bash
npm install
npm test          # Jest in ESM mode (node --experimental-vm-modules)
```

The tests import ESM-only packages (nanoid/zod/date-fns), so Jest runs in ESM
mode (`transform: {}` in `jest.config.js`, launched with
`--experimental-vm-modules`). After migration, the project runs on Vitest
(`vitest run`) instead — that is the target this fixture is meant to produce.

## License

MIT — see [LICENSE](LICENSE).
