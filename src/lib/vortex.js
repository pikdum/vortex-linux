import {
  chmodSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import path from "path";

import vortexDesktop from "../assets/vortex.desktop";
import vortexIcon from "../assets/vortex.ico";
import { BASE_DIR } from "./config.js";
import { protonRun } from "./proton.js";
import { downloadFile } from "./util.js";

const VORTEX_DIR = path.join(
  BASE_DIR,
  "compatdata",
  "pfx",
  "drive_c",
  "Program Files",
  "Black Tree Gaming Ltd",
  "Vortex",
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
      unlinkSync(targetPath);
    }

    await downloadFile(downloadUrl, targetPath);

    console.log("Vortex downloaded successfully!");
  } catch (error) {
    console.error("Error downloading Vortex:", error);
    throw error;
  }
};

export const installVortex = async (vortexInstaller) => {
  const vortexInstallerPath = path.join(
    BASE_DIR,
    "vortex-installers",
    vortexInstaller,
  );
  const command = `"${vortexInstallerPath}" /S`;
  await protonRun(command);
};

export const setupVortexDesktop = () => {
  const applicationsPath = path.join(
    process.env.HOME,
    ".local",
    "share",
    "applications",
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
    .replace("%%VORTEX_EXEC%%", `"${__filename}" launchVortex -- -d "%u"`)
    .replace("%%VORTEX_ICON%%", iconPath);

  writeFileSync(iconPath, iconData);
  writeFileSync(desktopPath, desktopData, "utf-8");
  chmodSync(desktopPath, "755");
};

export const launchVortex = async (args) => {
  const vortexExe = path.join(VORTEX_DIR, "Vortex.exe");
  let fullCommand = `"${vortexExe}"`;

  if (["-d", "-i"].includes(args?.[0]) && !args?.[1]?.includes("nxm")) {
    console.info(`No url provided, ignoring ${args[0]}`);
  } else {
    fullCommand += ` ${args.join(" ")}`;
  }

  console.log(`Launching Vortex: ${fullCommand}`);
  await protonRun(fullCommand);
};
