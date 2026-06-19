export interface Config {
  dbUrl: string;
  currentUserName?: string;
}

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = (cmdName: string) => CommandHandler;
