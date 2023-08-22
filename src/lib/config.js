import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import path from "path";

export const BASE_DIR = path.join(homedir(), ".vortex-linux");

export const getConfig = () => {
  const configPath = path.join(BASE_DIR, "config.json");

  // Create BASE_DIR if it doesn't exist
  if (!existsSync(BASE_DIR)) {
    mkdirSync(BASE_DIR, { recursive: true });
  }

  try {
    const fileContent = readFileSync(configPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
};

export const setConfig = (key, value) => {
  const config = getConfig();

  if (value === undefined) {
    delete config[key];
  } else {
    config[key] = value;
  }

  const configPath = path.join(BASE_DIR, "config.json");
  const configContent = JSON.stringify(config, null, 2);

  // Create BASE_DIR if it doesn't exist
  if (!existsSync(BASE_DIR)) {
    mkdirSync(BASE_DIR, { recursive: true });
  }

  try {
    writeFileSync(configPath, configContent, "utf-8");
  } catch (error) {
    console.error("Error saving config file:", error);
  }
};
