import { handlerLogin } from "./commandHandler.js";
import type { CommandHandler, CommandsRegistry } from "../types/config.js";

export function commandRegsitry(cmdName: string): CommandHandler {
  const commands: Record<string, CommandHandler> = {
    login: handlerLogin,
  };

  if (!commands[cmdName]) {
    throw new Error("Unknown command: " + cmdName);
  }

  return commands[cmdName];
}

// export function registerCommand(
//   registry: CommandsRegistry,
//   cmdName: string,
//   handler: CommandHandler,
// ): void {}

export function runCommand(cmdName: string, ...args: string[]): void {
  const handler = commandRegsitry(cmdName);
  handler(cmdName, ...args);
}
