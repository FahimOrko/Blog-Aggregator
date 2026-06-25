import os from "node:os";
import dotenv from "dotenv";
import type { Config } from "../types/types.js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { getUser } from "../db/lib/queries/users.js";

dotenv.config();

// --------------------------------------------------------
// Get the user's home directory
// --------------------------------------------------------
export function getHomeDir(): string {
  return os.homedir();
}

// --------------------------------------------------------
// Get the user's config file path
// --------------------------------------------------------
export function getConfigFilePath(): string {
  const homeDir = getHomeDir();
  return `${homeDir}/.gatorconfig.json`;
}

// --------------------------------------------------------
// Read the user's config file
// --------------------------------------------------------
export function readConfig(): Config {
  const configFilePath = getConfigFilePath();

  if (!existsSync(configFilePath)) {
    initializeConfigFile();
  }

  const configData = JSON.parse(readFileSync(configFilePath, "utf-8"));
  const result = {
    dbUrl: configData.db_url,
    currentUserName: configData.current_user_name,
  };
  return result;
}

// --------------------------------------------------------
// Set the user's name in the config file
// --------------------------------------------------------
export function setUserInConfig(name: string): string {
  const configFilePath = getConfigFilePath();
  const configData = JSON.parse(readFileSync(configFilePath, "utf-8"));
  const dataToWrite = {
    db_url: configData.db_url,
    current_user_name: name,
  };
  writeFileSync(configFilePath, JSON.stringify(dataToWrite));
  return name;
}

// --------------------------------------------------------
// Initialize the config file
// --------------------------------------------------------
export function initializeConfigFile(): string {
  const configFilePath = getConfigFilePath();

  if (existsSync(configFilePath)) {
    return "Found Config file.";
  }

  const defaultConfig = {
    db_url: process.env.DATABASE_URL || "postgres://example",
    current_user_name: "",
  };

  writeFileSync(
    configFilePath,
    JSON.stringify(defaultConfig, null, 2),
    "utf-8",
  );

  return "Config file initialized.";
}

// --------------------------------------------------------
// Get the current user from the config file
// --------------------------------------------------------
export async function getCurrentUser(): Promise<{
  userName: string;
  userId: string;
}> {
  const config = readConfig();
  const currentUserName = config.currentUserName;

  if (!currentUserName || currentUserName.trim() === "") {
    throw new Error("No current user set in config. Please log in first.");
  }

  const currentUserFromDB = await getUser(currentUserName);

  if (!currentUserFromDB) throw new Error("Please register user first.");

  return { userName: currentUserName, userId: currentUserFromDB.id };
}
