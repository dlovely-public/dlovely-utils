import { resolve } from "./path.js";

import chalk from "chalk";
import { argv } from "#cli/utils/path";
export const is_dry = Boolean(argv.dry ?? argv.D);
if (is_dry) {
  console.log(chalk.bold.white(`本次运行为空运行模式`, "\n"));
  const { clear } = console;
  console.clear = () => {
    if (is_dry) return console.log(chalk.cyan`[dry run]`, "clear");
    clear();
  };
}

import { spawn, spawnSync } from "bun";
export const $ = (cmd: string[], options?: SpawnOptions) =>
  new Promise<void>((resolve, reject) => {
    const { timeout, cwd } = { ...DefaultSpawnOptions, ...options };
    const stream = spawn(cmd, { stdout: "inherit", stderr: "inherit", cwd });
    const timer = setTimeout(() => {
      stream.kill(0);
      reject(`[timeout] over ${timeout / 1000}s`);
    }, timeout);
    stream.exited.then((code) => {
      clearTimeout(timer);
      if (code) reject();
      else resolve();
    });
  });

import { rm } from "./consola";
export const $$ = (cmd: string[], options?: Omit<SpawnOptions, "timeout">) =>
  new Promise<string>((resolve, reject) => {
    const { cwd } = { ...DefaultSpawnOptions, ...options };
    const stream = spawnSync(cmd, { cwd });
    if (stream.exitCode) reject(rm(stream.stderr));
    else resolve(rm(stream.stdout));
  });

export const dry = async (cmd: string[], options?: SpawnOptions) =>
  console.log(chalk.cyan`[dry run]`, cmd.join(" "));

$.dry = dry;
$.maydry = (cmd: string[], options?: SpawnOptions) => {
  if (is_dry) {
    dry(cmd);
    return Promise.resolve();
  }
  return $(cmd, options);
};

$$.dry = dry;
$$.maydry = (cmd: string[], options?: SpawnOptions) => {
  if (is_dry) {
    dry(cmd);
    return Promise.resolve("");
  }
  return $$(cmd, options);
};

export interface SpawnOptions {
  timeout?: number;
  cwd?: string;
}
export const DefaultSpawnOptions: Required<SpawnOptions> = {
  timeout: 1000 * 30,
  cwd: resolve(),
};

export const exit = (code = 0) => {
  if (is_dry) console.log(`[dry run] exit ${code}`);
  else process.exit(code);
};
