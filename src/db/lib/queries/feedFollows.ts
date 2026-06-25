import db from "../../db.js";
import { eq } from "drizzle-orm";
import { feed_follows, feeds, users } from "../../schema.js";
import { Feed, User, FeedFollows } from "../../schema.js";

export type FeedFollowWithRelations = {
  feed_follows: FeedFollows;
  feeds: Feed;
  users: User;
};

export type UserFollowedFeeds = {
  id: string;
  feedName: string;
  userName: string;
};

export async function createFeedFollow(
  userId: string,
  feedId: string,
): Promise<FeedFollowWithRelations> {
  const [result] = await db
    .insert(feed_follows)
    .values({ userId: userId, feedId: feedId })
    .returning();

  const [modifiedResult] = await db
    .select()
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .where(eq(feed_follows.id, result.id));

  return modifiedResult;
}

export async function getUserFollowedFeeds(
  userId: string,
): Promise<UserFollowedFeeds[]> {
  const result = await db
    .select({
      id: feed_follows.id,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .where(eq(feed_follows.userId, userId));

  return result;
}
