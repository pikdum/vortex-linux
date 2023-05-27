import { exec } from "child_process";
import { program } from "commander";
import fs, { createWriteStream, existsSync, mkdirSync } from "fs";
import os from "os";
import path from "path";
import { pipeline } from "stream";
import tar from "tar";
import { promisify } from "util";

const BASE_DIR = path.join(os.homedir(), ".vortex-linux");

const execAsync = promisify(exec);
const pipelineAsync = promisify(pipeline);

const downloadProton = async (downloadUrl) => {
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

const downloadVortex = async (downloadUrl) => {
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

const protonRun = async (command) => {
  const protonPath = path.join(BASE_DIR, "proton-builds", "active", "proton");
  const compatdataPath = path.join(BASE_DIR, "compatdata");
  const vortexRuntime = process?.env?.VORTEX_RUNTIME;
  let fullCommand = `${protonPath} run ${command}`;

  if (vortexRuntime) {
    fullCommand = `${vortexRuntime}/run -- ${fullCommand}`;
  }

  // Create compatdataPath directory if it doesn't exist
  if (!existsSync(compatdataPath)) {
    mkdirSync(compatdataPath, { recursive: true });
  }

  const env = {
    ...process.env,
    STEAM_COMPAT_CLIENT_INSTALL_PATH: path.join(os.homedir(), ".steam", "root"),
    STEAM_COMPAT_DATA_PATH: compatdataPath,
  };

  try {
    const { stdout, stderr } = await execAsync(fullCommand, { env });
    console.log(stdout);
    console.error(stderr);
  } catch (error) {
    console.error("Error executing command:", error);
  }
};

const installVortex = async (vortexInstaller) => {
  const vortexInstallerPath = path.join(
    BASE_DIR,
    "vortex-installers",
    vortexInstaller
  );
  await protonRun(vortexInstallerPath);
};

const launchVortex = async (args) => {
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

const setProton = (protonBuild) => {
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

program.version("0.0.1");

program
  .command("downloadProton <downloadUrl>")
  .description("Download Proton")
  .action(async (downloadUrl) => {
    await downloadProton(downloadUrl);
  });

program
  .command("setProton <protonBuild>")
  .description("Set Proton Build")
  .action((protonBuild) => {
    setProton(protonBuild);
  });

program
  .command("downloadVortex <downloadUrl>")
  .description("Download Vortex")
  .action(async (downloadUrl) => {
    await downloadVortex(downloadUrl);
  });

program
  .command("installVortex <vortexInstaller>")
  .description("Install Vortex")
  .action(async (vortexInstaller) => {
    await installVortex(vortexInstaller);
  });

program
  .command("launchVortex [args...]")
  .description("Launch Vortex")
  .action(async (args) => {
    await launchVortex(args);
  });

program.parse(process.argv);
