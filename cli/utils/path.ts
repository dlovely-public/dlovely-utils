import {
  resolve as _resolve,
  relative as _relative,
  dirname,
  join,
} from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __rootdir = join(__dirname, "../..");

export const resolve = _resolve.bind(null, __rootdir);
export const relative = (to: string, from?: string) =>
  _relative(to, from ? resolve(from) : resolve());
export { join };

import { createRequire } from "node:module";
export const require = createRequire(__rootdir);

import minimist from "minimist";
export const argv = minimist(process.argv.slice(2));
