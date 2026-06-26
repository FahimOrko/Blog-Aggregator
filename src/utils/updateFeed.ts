import { getFeedByUrl, updateFeed } from "../db/lib/queries/feeds";
import { Feed } from "../db/schema";

export async function markFeedFetched(url: string): Promise<Feed> {
  const feed = await getFeedByUrl(url);

  if (!feed) throw new Error("Feed doesn't exisit");

  const res = await updateFeed(feed.id);

  return feed;
}
