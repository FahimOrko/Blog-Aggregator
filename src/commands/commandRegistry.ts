import { middlewareLoggedIn } from "../middleware/middleware.js";
import type { CommandHandler } from "../types/types.js";
import {
  handlerAddFeed,
  handlerFetchRSS,
  handlerFollowFeed,
  handlerGetAllFeeds,
  handlerGetAllUserFollowedFeeds,
  handlerGetAllUsers,
  handlerLogin,
  handlerRegister,
  handlerReset,
} from "./commandHandler.js";

export async function commandRegsitry(
  cmdName: string,
): Promise<CommandHandler> {
  const commands: Record<string, CommandHandler> = {
    login: handlerLogin,
    register: handlerRegister,
    reset: handlerReset,
    users: handlerGetAllUsers,
    agg: handlerFetchRSS,
    feeds: handlerGetAllFeeds,
    addfeed: middlewareLoggedIn(handlerAddFeed),
    follow: middlewareLoggedIn(handlerFollowFeed),
    following: middlewareLoggedIn(handlerGetAllUserFollowedFeeds),
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

export async function runCommand(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = await commandRegsitry(cmdName);
  await handler(cmdName, ...args);
}
