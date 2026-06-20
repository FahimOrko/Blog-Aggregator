import type { RSSFeed } from "../../types/types.js";
import { parseXML } from "../../utils/xmlParser.js";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const options = {
    method: "GET",
    headers: {
      "User-Agent": "Gator RSS Reader/1.0",
      "Content-Type": "application/rss+xml",
    },
  };
  const res = await fetch(feedURL, options);
  const text = await res.text();
  const parsedXML = parseXML(text);

  if (!parsedXML || !parsedXML.rss) {
    throw new Error("Failed to parse RSS feed from URL: " + feedURL);
  }

  return parsedXML.rss;
}
