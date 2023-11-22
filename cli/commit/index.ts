import { $, $$ } from "#cli/utils/execa";
import chalk from "chalk";

import enquirer from "enquirer";
const { prompt } = enquirer;

console.clear();

const branch = await $$(["git", "branch", "--show-current"]);
console.log(`current branch: ${chalk.green(branch)}`);

const all_commit = await $$([`git log --pretty=format:"%H@%s@%ad"`]).catch(
  () => null,
);

import dayjs from "dayjs";
if (all_commit) {
  let { has_revert } = await prompt<{ has_revert: boolean }>({
    type: "confirm",
    name: "has_revert",
    message: `has revert? (是否有被撤销的提交)`,
    required: true,
  });
  if (has_revert) {
    const choices = all_commit.split("\n").map((item) => {
      const [hash, commit, time] = JSON.parse(item).split("@");
      return {
        name: hash,
        hint: `(${dayjs(time).format("YYYY/MM/DD HH:mm:ss")})${commit}`,
      };
    });
    const { hash } = await prompt<{ hash: string }>({
      type: "autocomplete",
      name: "hash",
      message: `choose revert commit (选择被撤销的提交)`,
      choices,
    });
    await commit(`revert: ${hash}`, [`This reverts commit ${hash}`]);
    process.exit(0);
  }
}

import items from "./items.json";
import types from "./types.json";
const type_list = types.map(({ name, icon, hint, allow }) => {
  let disabled = false;
  if (allow) {
    if (typeof allow === "string") disabled = allow !== branch;
    else disabled = !allow.includes(branch);
  }
  return { name, icon, hint, disabled };
});
const { type } = await prompt<{ type: string }>({
  type: "autocomplete",
  name: "type",
  message: `please select commit type (选择提交类型)`,
  choices: type_list,
  required: true,
  result: (name) => {
    const type = type_list.find((item) => item.name === name);
    if (!type) throw new Error(`未知的提交类型`);
    return type.name + type.icon;
  },
});

const item_list = ["source"];
switch (type.match(/^[a-z]+/)?.[0]) {
  case "feat":
  case "fix":
  case "perf":
  case "docs":
  case "refactor":
  case "test":
    item_list.push(...items);
    break;
  default:
    break;
}
const { item } = await prompt<{ item: string }>({
  type: "autocomplete",
  name: "item",
  message: `please select commit item (选择提交项目)`,
  choices: item_list,
  required: true,
});

const sub_item_list = ((item) => {
  if (items.includes(item)) {
    if (type.startsWith("docs")) return;
    const result = ["generator", "operation", "judge", "type"];
    switch (item) {
      case "array":
      case "object":
      case "function":
        result.push("merge");
        break;
      default:
        break;
    }
    return result;
  }
  switch (item) {
    case "source":
      return ["standard", "script", "structure"];
    default:
      return;
  }
})(item);
const { sub_item } = sub_item_list
  ? await prompt<{
      sub_item: string;
    }>({
      type: "autocomplete",
      name: "sub_item",
      message: `please select commit sub-item (选择提交子项目)`,
      choices: sub_item_list,
      required: true,
    })
  : { sub_item: null };

const { subject } = await prompt<{
  subject: string;
}>({
  type: "input",
  name: "subject",
  message: `please input commit subject (请输入提交内容的标题)`,
  required: true,
});

const body = [] as string[];
while (true) {
  const { item } = await prompt<{ item: string }>({
    type: "input",
    name: "item",
    message: `please input commit body (请输入提交内容的正文)`,
  });
  if (!item) break;
  body.push(item);
}

const demands = [] as number[];
while (true) {
  const { item } = await prompt<{ item: string }>({
    type: "input",
    name: "item",
    message: `please input finish issues (请输入完成的需求)`,
  });
  const demand = parseInt(item);
  if (!demand) break;
  demands.push(demand);
}

await commit(
  `${type}: [${item}]${sub_item ? `[${sub_item}]` : ""}${subject}`,
  body,
  demands,
);

async function commit(
  message: string = "",
  body: string[] = [],
  demands: number[] = [],
) {
  if (body.length) {
    message += "\n\n";
    if (body.length === 1) message += body[0];
    else message += body.map((item) => `  - ${item}`).join("\n");
  }
  if (demands.length) {
    message += "\n\nfinished: ";
    message += demands
      .map(
        (item) =>
          `[#${item}](https://github.com/dlovely-public/dlovely-utils/issues/${item})`,
      )
      .join();
  }

  console.clear();
  const { commit } = await prompt<{ commit: boolean }>({
    type: "confirm",
    name: "commit",
    message: `${message}\n\nabove is commit message, are you sure? (以上是提交信息, 确认提交?)`,
    required: true,
  });
  if (!commit) process.exit(0);

  console.clear();
  await $.maydry(["git", "commit", "-S", "-m", message]);
  const { push } = await prompt<{ push: boolean }>({
    type: "confirm",
    name: "push",
    message: `push to remote? (是否推送到远端)`,
    required: true,
  });

  if (push) {
    console.clear();
    console.log("pushing...");
    await $.maydry(["git", "push"]).catch(() => console.log("push failed"));
  }
}
