import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export const downloadFile = async (url, targetPath) => {
  try {
    console.log(`Downloading ${url}...`);
    const downloadCommand = `wget -O ${targetPath} ${url}`;
    await execAsync(downloadCommand);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const extractFile = async (file, directory) => {
  try {
    console.log(`Extracting ${file}...`);
    const extractCommand = `tar -xf ${file} -C ${directory}`;
    await execAsync(extractCommand);
  } catch (error) {
    console.error("Error extracting archive:", error);
    throw error;
  }
};
