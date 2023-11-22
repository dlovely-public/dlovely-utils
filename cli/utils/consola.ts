import ora, { Options, Ora } from "ora";

const { log, warn, error } = console;
let spinner: Ora | null = null;

console.log = (...data) => {
  if (!spinner?.isSpinning) return log(...data);
  const { text } = spinner;
  spinner.info(rm(data.join(" ")));
  spinner = ora(text).start();
};

console.info = (...data) => {
  if (!spinner?.isSpinning) return log(...data);
  const { text } = spinner;
  spinner.succeed(rm(data.join(" ")));
  spinner = ora(text).start();
};

console.warn = (...data) => {
  if (!spinner?.isSpinning) return warn(...data);
  const { text } = spinner;
  spinner.warn(rm(data.join(" ")));
  spinner = ora(text).start();
};

console.error = (...data) => {
  if (!spinner?.isSpinning) return error(...data);
  const { text } = spinner;
  spinner.fail(rm(data.join(" ")));
  spinner = ora(text).start();
};

console.ora = (options, status_if_exists = "stop", text_if_exists) => {
  console.oraOper(status_if_exists, text_if_exists);
  spinner = ora(options).start();
  return spinner;
};
console.oraOper = (status, text) => {
  if (!spinner?.isSpinning) return;
  spinner[status](text);
  spinner = null;
};

type OraOper = "stop" | "info" | "succeed" | "warn" | "fail";
declare global {
  interface Console {
    ora(
      options?: string | Options,
      status_if_exists?: OraOper,
      text_if_exists?: string,
    ): Ora;
    oraOper(status: OraOper, text?: string): void;
  }
}

export const rm = (str: string | { toString(): string }) => {
  if (typeof str !== "string") str = str.toString();
  return (str as string).replace(rm.search, "");
};
rm.search = /\n?$/;
