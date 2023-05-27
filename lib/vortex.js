import path from "path";
import fs, { createWriteStream, existsSync, mkdirSync } from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

import { BASE_DIR } from "./config.js";
import { protonRun } from "./proton.js";

const pipelineAsync = promisify(pipeline);

export const downloadVortex = async (downloadUrl) => {
  const installersPath = path.join(BASE_DIR, "vortex-installers");

  try {
    // Create installersPath directory if it doesn't exist
    if (!existsSync(installersPath)) {
      mkdirSync(installersPath, { recursive: true });
    }

    const filename = path.basename(downloadUrl);
    const targetPath = path.join(installersPath, filename);

    // Delete the file if it already exists
    if (existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    // Download the file
    const response = await fetch(downloadUrl);
    await pipelineAsync(response.body, createWriteStream(targetPath));

    console.log("Vortex downloaded successfully!");
  } catch (error) {
    console.error("Error downloading Vortex:", error);
  }
};

export const installVortex = async (vortexInstaller) => {
  const vortexInstallerPath = path.join(
    BASE_DIR,
    "vortex-installers",
    vortexInstaller
  );
  await protonRun(vortexInstallerPath);
};

export const launchVortex = async (args) => {
  const vortexExe = path.join(
    BASE_DIR,
    "compatdata",
    "pfx",
    "drive_c",
    "Program Files",
    "Black Tree Gaming Ltd",
    "Vortex",
    "Vortex.exe"
  );
  let fullCommand = `"${vortexExe}"`;
  if (args && (args !== "-d " || args !== "-i ")) {
    fullCommand += ` ${args}`;
  }
  await protonRun(fullCommand);
};
