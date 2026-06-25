import { Feed, User } from "../db/schema.js";

export function printFeed(feed: Feed, user: User): void {
  console.log("------------------------------------");
  console.log("New Feed Added");
  console.log(`Feed Name: ${feed.name}`);
  console.log(`Feed URL: ${feed.url}`);
  console.log(`Associated User: ${user.name}`);
  console.log("------------------------------------");
}

export function printFollowedFeedDetails(feed: Feed, user: User): void {
  console.log("------------------------------------");
  console.log("User Followed Feed");
  console.log(`User Name: ${user.name}`);
  console.log(`Feed Name: ${feed.name}`);
  console.log("------------------------------------");
}
