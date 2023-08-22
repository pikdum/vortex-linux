import { exec } from "child_process";
import { existsSync, lstatSync, mkdirSync, symlinkSync, unlinkSync } from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

import { BASE_DIR, getConfig } from "./config.js";
import { downloadFile, extractFile } from "./util.js";

const execAsync = promisify(exec);

export const downloadProton = async (downloadUrl) => {
  const tempFilePath = path.join(os.tmpdir(), "proton.tar.gz");
  const extractPath = path.join(BASE_DIR, "proton-builds");

  try {
    // Create extractPath directory if it doesn't exist
    if (!existsSync(extractPath)) {
      mkdirSync(extractPath, { recursive: true });
    }

    await downloadFile(downloadUrl, tempFilePath);
    await extractFile(tempFilePath, extractPath);

    console.log("Proton downloaded and extracted successfully!");
  } catch (error) {
    console.error("Error downloading and extracting Proton:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }
  }
};

export const protonRun = async (command) => {
  const protonPath = path.join(BASE_DIR, "proton-builds", "active", "proton");
  const compatdataPath = path.join(BASE_DIR, "compatdata");

  // Create compatdataPath directory if it doesn't exist
  if (!existsSync(compatdataPath)) {
    mkdirSync(compatdataPath, { recursive: true });
  }

  const env = {
    ...process.env,
    ...getConfig(),
    STEAM_COMPAT_CLIENT_INSTALL_PATH: path.join(os.homedir(), ".steam", "root"),
    STEAM_COMPAT_DATA_PATH: compatdataPath,
  };

  const steamRuntimePath = env?.STEAM_RUNTIME_PATH;
  let fullCommand = `${protonPath} run ${command}`;

  if (steamRuntimePath) {
    fullCommand = `${steamRuntimePath}/run -- ${fullCommand}`;
  }

  try {
    const { stdout, stderr } = await execAsync(fullCommand, { env });
    console.log(stdout);
    console.error(stderr);
  } catch (error) {
    console.error("Error executing command:", error);
    throw error;
  }
};

export const setProton = (protonBuild) => {
  const activeSymlinkPath = path.join(BASE_DIR, "proton-builds", "active");

  try {
    // Remove existing symlink if it exists
    if (existsSync(activeSymlinkPath)) {
      unlinkSync(activeSymlinkPath);
    }

    const protonBuildPath = path.join(BASE_DIR, "proton-builds", protonBuild);

    // Verify that protonBuildPath is a valid directory
    if (
      !existsSync(protonBuildPath) ||
      !lstatSync(protonBuildPath).isDirectory()
    ) {
      throw new Error(
        `Proton build directory '${protonBuild}' does not exist.`,
      );
    }

    // Create new symlink
    symlinkSync(protonBuildPath, activeSymlinkPath);

    console.log(`Proton set to: ${protonBuild}`);
  } catch (error) {
    console.error("Error setting Proton:", error);
    throw error;
  }
};

export const protonRunUrl = async (downloadUrl, args) => {
  const tempFilePath = path.join(os.tmpdir(), path.basename(downloadUrl));

  let command = tempFilePath;
  if (args) {
    command += ` ${args}`;
  }

  try {
    // Download the file
    await downloadFile(downloadUrl, tempFilePath);

    // Run protonRun with the command
    console.log(`Running: ${command}`);
    await protonRun(command);
  } catch (error) {
    console.error("Error running protonRun:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }
  }
};
