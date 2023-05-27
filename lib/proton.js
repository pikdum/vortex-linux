import tar from "tar";
import { exec } from "child_process";
import path from "path";
import fs, { createWriteStream, existsSync, mkdirSync } from "fs";
import os from "os";
import { promisify } from "util";
import { pipeline } from "stream";

import { BASE_DIR, getConfig } from "./config.js";

const pipelineAsync = promisify(pipeline);
const execAsync = promisify(exec);

export const downloadProton = async (downloadUrl) => {
  const tempFilePath = path.join(os.tmpdir(), "proton.tar.gz");
  const extractPath = path.join(BASE_DIR, "proton-builds");

  try {
    // Create extractPath directory if it doesn't exist
    if (!existsSync(extractPath)) {
      mkdirSync(extractPath, { recursive: true });
    }

    // Download the file
    const response = await fetch(downloadUrl);
    await pipelineAsync(response.body, createWriteStream(tempFilePath));

    // Extract the file
    await tar.x({ file: tempFilePath, cwd: extractPath });

    console.log("Proton downloaded successfully!");
  } catch (error) {
    console.error("Error downloading Proton:", error);
  } finally {
    // Clean up the temporary file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
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

  const vortexRuntime = env?.VORTEX_RUNTIME;
  let fullCommand = `${protonPath} run ${command}`;

  if (vortexRuntime) {
    fullCommand = `${vortexRuntime}/run -- ${fullCommand}`;
  }

  try {
    const { stdout, stderr } = await execAsync(fullCommand, { env });
    console.log(stdout);
    console.error(stderr);
  } catch (error) {
    console.error("Error executing command:", error);
  }
};

export const setProton = (protonBuild) => {
  const activeSymlinkPath = path.join(BASE_DIR, "proton-builds", "active");

  try {
    // Remove existing symlink if it exists
    if (fs.existsSync(activeSymlinkPath)) {
      fs.unlinkSync(activeSymlinkPath);
    }

    const protonBuildPath = path.join(BASE_DIR, "proton-builds", protonBuild);

    // Verify that protonBuildPath is a valid directory
    if (
      !fs.existsSync(protonBuildPath) ||
      !fs.lstatSync(protonBuildPath).isDirectory()
    ) {
      throw new Error(
        `Proton build directory '${protonBuild}' does not exist.`
      );
    }

    // Create new symlink
    fs.symlinkSync(protonBuildPath, activeSymlinkPath);

    console.log(`Proton set to: ${protonBuild}`);
  } catch (error) {
    console.error("Error setting Proton:", error);
  }
};
