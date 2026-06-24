import { Feed, User } from "../db/schema.js";

export function printFeed(feed: Feed, user: User): void {
  console.log(`Feed Name: ${feed.name}`);
  console.log(`Feed URL: ${feed.url}`);
  console.log(`Associated User: ${user.name}`);
}
