import path from "path";
import fs, { createWriteStream, existsSync, mkdirSync } from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

import { BASE_DIR } from "./config.js";
import { protonRun } from "./proton.js";

import vortexIcon from "../assets/vortex.ico";
import vortexDesktop from "../assets/vortex.desktop";

const pipelineAsync = promisify(pipeline);

const VORTEX_DIR = path.join(
  BASE_DIR,
  "compatdata",
  "pfx",
  "drive_c",
  "Program Files",
  "Black Tree Gaming Ltd",
  "Vortex"
);

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

export const setupVortexDesktop = () => {
  const applicationsPath = path.join(
    process.env.HOME,
    ".local",
    "share",
    "applications"
  );
  const iconPath = path.join(applicationsPath, "vortex.ico");
  const desktopPath = path.join(applicationsPath, "vortex.desktop");

  // Create applicationsPath directory if it doesn't exist
  if (!existsSync(applicationsPath)) {
    mkdirSync(applicationsPath, { recursive: true });
  }

  // Write icon and desktop files
  const iconData = Buffer.from(vortexIcon.split(",")[1], "base64");
  const desktopData = vortexDesktop
    .replace("%%VORTEX_PATH%%", VORTEX_DIR)
    .replace("%%VORTEX_EXEC%%", `"${__filename}" launchVortex -- -d %u`)
    .replace("%%VORTEX_ICON%%", iconPath);

  fs.writeFileSync(iconPath, iconData);
  fs.writeFileSync(desktopPath, desktopData, "utf-8");
  fs.chmodSync(desktopPath, "755");
};

export const launchVortex = async (args) => {
  const vortexExe = path.join(VORTEX_DIR, "Vortex.exe");
  let fullCommand = `"${vortexExe}"`;

  if (["-d", "-i"].includes(args?.[0]) && args?.length === 1) {
    console.info(`No url provided, ignoring ${args[0]}`);
  } else {
    fullCommand += ` ${args.join(" ")}`;
  }

  await protonRun(fullCommand);
};
