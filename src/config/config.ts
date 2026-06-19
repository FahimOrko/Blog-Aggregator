import os from "node:os";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Config } from "../types/types.js";

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
    return "Config file already exists.";
  }

  const defaultConfig = {
    db_url: "postgres://example",
    current_user_name: "",
  };

  writeFileSync(
    configFilePath,
    JSON.stringify(defaultConfig, null, 2),
    "utf-8",
  );

  return "Config file initialized.";
}
