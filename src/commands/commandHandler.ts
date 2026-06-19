import {
  createUser,
  deleteAllUsers,
  getUser,
} from "../db/lib/queries/users.js";
import { setUserInConfig } from "../config/config.js";

// --------------------------------------------------------
// Handler for the "login" command
// --------------------------------------------------------
export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0 || args.length > 1) {
    throw new Error("Login handler expected 1 argument, got " + args.length);
  }

  const name = args[0];

  const checkUser = await getUser(name);

  if (checkUser) {
    setUserInConfig(name);
    console.log(`User logged in:`, name);
    return;
  }

  throw new Error(`User with name ${name} does not exist.`);
}

// --------------------------------------------------------
// Handler for the "reset" command
// --------------------------------------------------------
export async function handlerReset(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length) {
    throw new Error("Reset handler expected 0 argument, got " + args.length);
  }

  const reset = await deleteAllUsers();

  if (reset) {
    console.log(`All users successfully deleted from database.`);
    return;
  }

  throw new Error(`Failed to delete all users.`);
}

// --------------------------------------------------------
// Handler for the "register" command
// --------------------------------------------------------
export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0 || args.length > 1) {
    throw new Error("Register handler expected 1 argument, got " + args.length);
  }

  const name = args[0];
  const checkUser = await getUser(name);

  if (!checkUser) {
    const newUser = await createUser(name);
    console.log(`New user succefully created at database:`, newUser.name);
    await handlerLogin(cmdName, name);
    return;
  }

  throw new Error(`User with name ${name} already exists.`);
}
