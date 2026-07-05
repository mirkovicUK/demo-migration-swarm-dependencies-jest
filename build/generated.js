// build/generated.js — simulated build output.
// EXCLUSION FIXTURE (Req 7.1/7.2/7.3): the `build/` directory is on the
// default exclude list, so the analyzer must not descend into it. Its import
// of the (undeclared, fake) package `webpack-runtime-shim` must NEVER appear
// in the generated package.json dependencies, and `build` must never appear
// in the tsconfig `include`.
import { __webpack_require__ } from "webpack-runtime-shim";
export const bootstrap = () => __webpack_require__(0);
