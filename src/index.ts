import { initializeConfigFile } from "./config.js";
import { argv } from "node:process";
import { runCommand } from "./commands/commandRegistry.js";

function main() {
  console.log(initializeConfigFile());

  const commandName = argv[2];
  const commandArgs = argv.slice(3);

  if (!commandName) {
    throw new Error("No command provided.");
  }

  runCommand(commandName, ...commandArgs);
}

main();
