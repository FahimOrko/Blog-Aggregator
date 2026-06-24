import db from "../../db.js";
import { eq } from "drizzle-orm";
import { feeds } from "../../schema.js";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return result;
}

export async function getFeed(name: string) {
  const [row] = await db.select().from(feeds).where(eq(feeds.name, name));
  return row;
}

export async function getAllFeeds() {
  const rows = await db.select().from(feeds);
  return rows;
}

// export async function deleteAllUsers() {
//   await db.delete(users);
//   return true;
// }
