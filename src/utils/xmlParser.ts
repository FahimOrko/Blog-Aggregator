import { XMLParser } from "fast-xml-parser";
import type { RSSFeed } from "../types/types.js";

export const parseXML = (xml: string) => {
  const parser = new XMLParser({ processEntities: false });
  const result = parser.parse(xml);
  return result;
};
