import {
  createUser,
  deleteAllUsers,
  getUser,
  getAllUsers,
} from "../db/lib/queries/users.js";
import { readConfig, setUserInConfig } from "../config/config.js";
import { fetchFeed } from "./rss/commands.js";
import { RSSFeed, RSSItem } from "src/types/types.js";

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

// --------------------------------------------------------
// Handler for the "users" command
// --------------------------------------------------------
export async function handlerGetAllUsers(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length) {
    throw new Error("Users handler expected 0 argument, got " + args.length);
  }

  const allUsers = await getAllUsers();

  if (allUsers.length != 0) {
    const currentUser = readConfig().currentUserName;
    allUsers.forEach((user) => {
      console.log(
        `* ${user.name} ${user.name === currentUser ? "(current)" : ""}`,
      );
    });
    return;
  }

  console.log(`No users found in database.`);
  return;
}

// --------------------------------------------------------
// Handler for the "agg" command
// --------------------------------------------------------
export async function handlerFetchRSS(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  // if (args.length === 0 || args.length > 1) {
  //   throw new Error(
  //     "Fetch-RSS handler expected 1 argument, got " + args.length,
  //   );
  // }

  if (args.length) {
    throw new Error(
      "Fetch-RSS handler expected 0 arguments, got " + args.length,
    );
  }

  const url = `https://www.wagslane.dev/index.xml`;
  const feed = await fetchFeed(url);

  if (!feed) {
    throw new Error(`Failed to fetch RSS feed from URL: ${url}`);
  }

  if (
    !feed.channel ||
    !feed.channel.title ||
    !feed.channel.link ||
    !feed.channel.description
  ) {
    throw new Error(`Invalid RSS feed format from URL: ${url}`);
  }

  let items: RSSItem[] | RSSItem = [];

  if (feed.channel.item && Array.isArray(feed.channel.item)) {
    for (const item of feed.channel.item) {
      if (item.title && item.link && item.description && item.pubDate) {
        items.push(item);
      }
    }
  }

  if (feed.channel.item && !Array.isArray(feed.channel.item)) {
    items = feed.channel.item;
  }

  const res = {
    channel: {
      title: feed.channel.title,
      link: feed.channel.link,
      description: feed.channel.description,
      item: items,
    },
  };

  console.log(`Successfully fetched RSS feed from URL: ${url}`);
  console.log(res.channel);
}
