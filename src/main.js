import { program } from "commander";

import { downloadProton, setProton, protonRunUrl } from "./lib/proton.js";
import {
  downloadVortex,
  installVortex,
  launchVortex,
  setupVortexDesktop,
} from "./lib/vortex.js";

import { getConfig, setConfig } from "./lib/config.js";

const originalEmit = process.emit;
// eslint-disable-next-line
process.emit = function (name, data, ...args) {
  if (
    name === `warning` &&
    typeof data === `object` &&
    data.name === `ExperimentalWarning`
  ) {
    return false;
  }
  return originalEmit.apply(process, arguments);
};

// x-release-please-start-version
program.version("1.2.0");
// x-release-please-end

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

program
  .command("setupVortexDesktop")
  .description("Setup .desktop entry for Vortex")
  .action(() => {
    setupVortexDesktop();
  });

program
  .command("getConfig")
  .description("Output config")
  .action(() => {
    console.log(JSON.stringify(getConfig(), null, 2));
  });

program
  .command("setConfig <key> [value]")
  .description("Set config key")
  .action((key, value) => {
    setConfig(key, value);
    console.log(JSON.stringify(getConfig(), null, 2));
  });

program
  .command("protonRunUrl <downloadUrl> [args]")
  .description("Download and run an .exe")
  .action(async (downloadUrl, args) => {
    await protonRunUrl(downloadUrl, args);
  });

program.parse(process.argv);
