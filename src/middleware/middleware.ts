import { CommandHandler, UserCommandHandler } from "../types/types.js";
import { getUser } from "../db/lib/queries/users";
import { readConfig } from "../config/config";

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName, ...args) => {
    const config = readConfig();
    const currentUserName = config.currentUserName;

    if (!currentUserName || currentUserName.trim() === "") {
      throw new Error("No current user set in config. Please log in first.");
    }

    const currentUserFromDB = await getUser(currentUserName);

    if (!currentUserFromDB) throw new Error("Please register user first.");

    const user = { userName: currentUserName, userId: currentUserFromDB.id };

    await handler(cmdName, user, ...args);
  };
}
