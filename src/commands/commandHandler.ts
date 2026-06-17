import { setUserInConfig } from "../config.js";

// --------------------------------------------------------
// Handler for the "login" command
// --------------------------------------------------------
export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (args.length === 0 || args.length > 1) {
    throw new Error("Login handler expected 1 argument, got " + args.length);
  }

  const name = args[0];
  setUserInConfig(name);
  console.log(`New user name:`, name);
}
