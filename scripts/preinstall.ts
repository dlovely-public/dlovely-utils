if (Number(process.version.split(".")[0].replace("v", "")) < 20) {
  console.warn(
    `\u001b[33mThis repository requires node 20 or greater.\u001b[39m\n`,
  );
  process.exit(1);
}

if (!/bun/.test(process.env.npm_execpath || "")) {
  console.warn(
    `\u001b[33mThis repository requires using bun as the package manager` +
      ` for scripts to work properly.\u001b[39m\n`,
  );
  process.exit(1);
}
