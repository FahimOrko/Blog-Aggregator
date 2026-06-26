import { feeds } from "src/db/schema.js";
import { readConfig, setUserInConfig } from "../config/config.js";
import {
  createFeedFollow,
  deleteFeedFollow,
  getUserFollowedFeeds,
} from "../db/lib/queries/feedFollows.js";
import {
  createFeed,
  getAllFeeds,
  getFeed,
  getFeedByUrl,
} from "../db/lib/queries/feeds.js";
import {
  createUser,
  deleteAllUsers,
  getAllUsers,
  getUser,
  getUserById,
} from "../db/lib/queries/users.js";
import { CurrentUser, RSSItem } from "../types/types.js";
import {
  printFeed,
  printFollowedFeedDetails,
  printUnfollowedFeedDetails,
} from "../utils/common.js";
import { fetchFeed } from "./rss/commands.js";

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
    console.log(`New user successfully created at database:`, newUser.name);
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

// --------------------------------------------------------
// Handler for the "feeds" command
// --------------------------------------------------------
export async function handlerGetAllFeeds(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length) {
    throw new Error("Feeds handler expected 0 argument, got " + args.length);
  }

  const allFeeds = await getAllFeeds();

  if (allFeeds.length != 0) {
    for (const feed of allFeeds) {
      const userName = (await getUserById(feed.userId)).name;
      console.log(
        `-------------------------------------\nFeed Name: ${feed.name}\nURL: ${feed.url}\nUser Name: ${userName}\n-------------------------------------`,
      );
    }
    return;
  }

  console.log(`No feeds found in database.`);
  return;
}

// --------------------------------------------------------
// Handler for the "addfeed" command
// --------------------------------------------------------
export async function handlerAddFeed(
  cmdName: string,
  user: CurrentUser,
  ...args: string[]
): Promise<void> {
  if (args.length === 0 || args.length === 1 || args.length > 2) {
    throw new Error("Add Feed handler expected 2 argument, got " + args.length);
  }

  const name = args[0];
  const url = args[1];

  const feed = await getFeed(name);

  if (feed) throw new Error("Feed already exists");

  const feedFromDB = await createFeed(name, url, user.userId);

  if (!feedFromDB) {
    throw new Error(`Failed to create feed in database.`);
  }

  await createFeedFollow(user.userId, feedFromDB.id);

  printFeed(feedFromDB, user);
}

// --------------------------------------------------------
// Handler for the "follow" command
// --------------------------------------------------------
export async function handlerFollowFeed(
  cmdName: string,
  user: CurrentUser,
  ...args: string[]
): Promise<void> {
  if (args.length === 0 || args.length > 1) {
    throw new Error(
      "Follow feed handler expected 1 argument, got " + args.length,
    );
  }

  const url = args[0];

  const feed = await getFeedByUrl(url);

  if (!feed) throw new Error(`Couldn't find feed`);

  const feedFollowed = await createFeedFollow(user.userId, feed.id);

  printFollowedFeedDetails(feedFollowed.feeds, user);
}

// --------------------------------------------------------
// Handler for the "following" command
// --------------------------------------------------------
export async function handlerGetAllUserFollowedFeeds(
  cmdName: string,
  user: CurrentUser,
  ...args: string[]
): Promise<void> {
  if (args.length) {
    throw new Error(
      "Following handler expected 0 argument, got " + args.length,
    );
  }

  const userFollowedFeeds = await getUserFollowedFeeds(user.userId);

  if (userFollowedFeeds.length != 0) {
    for (const item of userFollowedFeeds) {
      console.log(
        `-------------------------------------\nFeed Name: ${item.feedName}\nUser Name: ${item.userName}\n-------------------------------------`,
      );
    }
    return;
  }

  console.log(`No user followed feed found in database`);
  return;
}

// --------------------------------------------------------
// Handler for the "unfollow" command
// --------------------------------------------------------
export async function handlerUnfollowFeed(
  cmdName: string,
  user: CurrentUser,
  ...args: string[]
): Promise<void> {
  if (args.length === 0 || args.length > 1) {
    throw new Error(
      "Follow feed handler expected 1 argument, got " + args.length,
    );
  }
  const url = args[0];

  const feed = await getFeedByUrl(url);

  if (!feed) throw new Error(`Couldn't find feed`);

  await deleteFeedFollow(user.userId, feed.id);

  printUnfollowedFeedDetails(feed, user);
}
