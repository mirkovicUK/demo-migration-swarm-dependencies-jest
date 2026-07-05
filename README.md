# demo-migration-swarm-deps

Fixed demo repository (vanilla HTML/CSS/JS) for validating Migration
Swarm's **dependency-aware scaffold**. Unlike the first demo repo
(dependency-free), every module here leans on a real, non-trivial npm
package — so a migration run only succeeds if the scaffold actually
resolves, installs, and correctly types third-party dependencies
instead of relying on a fixed trio of dev-only packages.

## Why this repo exists

The original demo proves the swarm's coordination, memory, and
verification loop on a dependency-free codebase. It cannot exercise
dependency resolution, because it has none. This repo is the minimal
next fixture: same architectural shape (a hot shared module, a real
dependency chain, a barrel, a dynamic import), but built on top of
**three real, independently-versioned runtime packages** instead of
hand-rolled logic.

A successful migration of this repo demonstrates that the scaffold:

- parses real import specifiers and tells them apart from relative
  imports and Node builtins,
- resolves each to a real npm package name + version,
- merges them into the *generated* `package.json` (rather than
  discarding them in favor of a fixed dev-only trio),
- runs a real `npm install` against them before any file is rewritten,
- and produces a TypeScript build that actually compiles against
  those installed packages — including one library (`zod`) whose
  idiomatic TypeScript usage (`z.infer<...>`) doesn't exist in the
  JavaScript source, making the type surface a genuine post-migration
  addition rather than a mechanical annotation.

## Dependencies (real, pinned in `package.json` + `package-lock.json`)

| Package     | Used in           | Why it's here                                                                 |
|-------------|--------------------|--------------------------------------------------------------------------------|
| `nanoid`    | `js/id.js`         | HOT ⭐ — id generation, imported by nearly every other module                  |
| `zod`       | `js/validate.js`   | Runtime validation; its TS-only inferred-type ergonomics are a good post-migration type-surface test |
| `date-fns`  | `js/format.js`     | A second, independent library — proves the scaffold handles more than one real dependency at once |

All three are ESM-native, have no native bindings, and ship their own
TypeScript types — chosen deliberately so a failed migration can only
be attributed to the scaffold/engine, not to an unrelated packaging
quirk in the dependency itself.

## Structure

```
index.html            page shell; loads js/app.js as <script type="module">
css/style.css         styling
jsconfig.json         path-alias config (@app/* -> js/*) — scaffold-detection fixture
assets/bell.svg       image asset imported by js/theme.js
js/id.js              HOT ⭐ nanoid-backed id generation (imported everywhere)
js/validate.js        zod schema + validation                (→ nothing)
js/format.js          date-fns based due-date formatting      (→ nothing)
js/theme.js           asset + node: builtin + date-fns subpath imports (fixture)
js/task.js            Task model + validation                 (→ id, validate)
js/filter.js          filter/search predicates over tasks      (→ task)
js/board.js           board/column state, orchestration        (→ id, task, filter, format)
js/storage.js         localStorage persistence + dynamic import (→ index barrel)
js/index.js           re-export barrel                        (→ everything)
js/app.js             DOM wiring / entry module                (→ board, format, storage, theme)
vendor/legacy.min.js  EXCLUDED fixture (vendor dir + *.min.js) — must be ignored
build/generated.js    EXCLUDED fixture (build dir) — must be ignored
test/id.test.js       id generation + safe-alphabet checks
test/validate.test.js schema acceptance/rejection cases
test/format.test.js   due-date formatting, status, relative labels
test/task.test.js     task lifecycle: create, complete, move, overdue
test/filter.test.js   column/priority/search filtering, sorting
test/board.test.js    end-to-end board state across all modules
```

## What this fixture exercises (dependency-aware-scaffold requirements)

| Requirement | Where in this repo | Expected scaffold behavior |
|---|---|---|
| Bare-specifier extraction, static forms (Req 2.1) | `import … from` (everywhere), `export * from` (`js/index.js`), dynamic `import()` (`js/storage.js`) | `nanoid`, `zod`, `date-fns` collected as external deps |
| Package-name normalization, subpath (Req 2.4) | `date-fns/locale` in `js/theme.js` | normalized to `date-fns` (no duplicate entry) |
| `node:` builtin excluded (Req 2.5) | `node:os` in `js/theme.js` | NOT added to `dependencies` (typed via `@types/node`) |
| Union with source manifest + pinned versions (Req 3) | `package.json` pins `date-fns`, `nanoid`, `zod` | generated `dependencies` use those exact versions |
| Data-driven `package.json` (Req 4) | three real runtime deps | all three merged; tooling devDeps retained; no stray `@types/*` |
| tsconfig `include` from real source dirs (Req 5.1) | code in `js/` and `test/` | `include` covers `js`, `test` (not just `src`) |
| Path aliases → tsconfig `paths` + vite `resolve.alias` (Req 5.2/5.3) | `jsconfig.json` `paths` `@app/* -> js/*` | one matching `paths` entry and one `resolve.alias` entry |
| Asset ambient-module shims (Req 6) | `import "../css/style.css"`, `import bell from "../assets/bell.svg"` in `js/theme.js` | `src/asset-shims.d.ts` declares `*.css` and `*.svg` |
| Exclusion of non-app files (Req 7) | `vendor/legacy.min.js` (imports `jquery-legacy`), `build/generated.js` (imports `webpack-runtime-shim`) | those packages never appear in deps; `vendor`/`build` never in `include` |

These fixtures cover the **deterministic analyzer + scaffold** paths. Two
requirements are validated by the engine's own property/integration tests
rather than by this source repo, because they cannot be triggered green from
static source alone:

- **URL-specifier / `require()` classification** — a literal `https://…` or
  CommonJS `require()` import would fail the `tsc` gate, so those forms live in
  the property tests, not here.
- **Dependency self-heal (Req 11)** — self-heal fires only for a bare specifier
  the *static* analyzer cannot see but the build still names in a `Cannot find
  module` diagnostic; that is exercised via the verification subprocess seam.

## Run it

The unit suite runs with no build step:

```bash
npm install
npm test          # runs all 32 tests via node's built-in test runner
```

`js/theme.js` (imported only by the browser entry `js/app.js`) uses
bundler-style asset imports (`*.css`, `*.svg`) and a path alias, so the
browser entry now expects a bundler (Vite) rather than opening `index.html`
directly — which is exactly the migrated target this fixture is meant to
produce. The `node --test` suite does not touch `js/app.js`/`js/theme.js`, so
it stays green as-is.

## License

MIT — see [LICENSE](LICENSE).
