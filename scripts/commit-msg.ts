import chalk from "chalk";
import { readFileSync } from "fs";
import path from "path";

const msgPath = path.resolve(".git/COMMIT_EDITMSG");
const msg = readFileSync(msgPath, "utf-8").trim();

import types from "../cli/commit/types.json";
const type = types.map((item) => item.name).join("|");

const commitRE = new RegExp(`^(revert: )?(${type})(\\(.+\\))?(.+)?: .{1,100}`);

if (!commitRE.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(
      `invalid commit message format.`,
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation.\n  Examples:\n\n`,
      ) +
      `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
      `    ${chalk.green(
        `fix(v-model): handle events on blur (close #28)`,
      )}\n\n` +
      chalk.red(
        `  See ${chalk.cyan(
          ".github/commit-convention.md",
        )} for more details.\n`,
      ),
  );
  process.exit(1);
}
