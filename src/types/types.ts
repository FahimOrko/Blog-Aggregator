// --------------------------------------------------------
// This file contains type definitions for the project, including configuration types, command handler types, and RSS feed parsing types.
// --------------------------------------------------------

// --------------------------------------------------------
// Type for application configuration
// --------------------------------------------------------
export interface Config {
  dbUrl: string;
  currentUserName?: string;
}

// --------------------------------------------------------
// Types for command handling
// --------------------------------------------------------
export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: CurrentUser,
  ...args: string[]
) => Promise<void>;

export type CurrentUser = {
  userName: string;
  userId: string;
};

export type CommandsRegistry = (cmdName: string) => CommandHandler;

// --------------------------------------------------------
// Types for RSS feed parsing
// --------------------------------------------------------
export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    generator?: string;
    language?: string;
    lastBuildDate?: string;
    item: RSSItem[] | RSSItem;
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};
