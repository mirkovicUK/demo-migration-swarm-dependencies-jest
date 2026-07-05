// js/theme.js — theming / presentation helpers.
//
// This module exists mainly to widen the dependency-aware-scaffold coverage
// of the demo repo. It exercises, in one real module:
//
//   - a side-effect ASSET import of a stylesheet (`../css/style.css`) and a
//     default ASSET import of an image (`../assets/bell.svg`). Neither is a
//     code module, so the analyzer must record their extensions as asset
//     kinds (Req 6.1) and the scaffold must emit an ambient-module shim
//     `.d.ts` declaring `*.css` / `*.svg` so `tsc --noEmit` accepts them.
//   - a `node:` BUILTIN import (`node:os`). It must be classified BUILTIN and
//     therefore EXCLUDED from the external dependency set (Req 2.5) — it is
//     provided by `@types/node`, never installed from npm.
//   - a SUBPATH import of an already-declared package (`date-fns/locale`).
//     Its normalized package name is `date-fns` (Req 2.4: `name/sub -> name`),
//     so it must NOT introduce a second, spurious dependency entry.
import "../css/style.css";
import bellIconUrl from "../assets/bell.svg";
import { EOL } from "node:os";
import { enGB } from "date-fns/locale";

// The bundler turns the SVG import into a URL string; re-exported so the entry
// module can render it. (In the browser/vite build this is a real asset URL.)
export const BELL_ICON = bellIconUrl;

// A concrete date-fns locale, proving the subpath import resolves to the same
// installed `date-fns` package the rest of the app already depends on.
export const DATE_LOCALE = enGB;

// Join lines with the platform newline from the node builtin, so the builtin
// import is actually used (not dead code the migrator might drop).
export function banner(lines) {
  return lines.join(EOL);
}
