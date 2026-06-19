import { initializeConfigFile } from "./config/config.js";
import { argv } from "node:process";
import { runCommand } from "./commands/commandRegistry.js";

async function main() {
  console.log(initializeConfigFile());

  const commandName = argv[2];
  const commandArgs = argv.slice(3);

  if (!commandName) {
    throw new Error("No command provided.");
  }

  await runCommand(commandName, ...commandArgs);

  process.exit(0);
}

main();
