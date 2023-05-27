import os from "os";
import fs from "fs";
import path from "path";

export const BASE_DIR = path.join(os.homedir(), ".vortex-linux");

export const getConfig = () => {
  const configPath = path.join(BASE_DIR, "config.json");
  try {
    const fileContent = fs.readFileSync(configPath, "utf-8");
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

  try {
    fs.writeFileSync(configPath, configContent, "utf-8");
  } catch (error) {
    console.error("Error saving config file:", error);
  }
};
