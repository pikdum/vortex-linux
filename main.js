import { program } from "commander";

import { downloadProton, setProton } from "./lib/proton.js";
import { downloadVortex, installVortex, launchVortex } from "./lib/vortex.js";

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
