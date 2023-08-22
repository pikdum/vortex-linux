import axios from "axios";
import { exec } from "child_process";
import { createWriteStream } from "fs";
import util from "util";

const execAsync = util.promisify(exec);

export const downloadFile = async (url, targetPath) => {
  try {
    console.log(`Downloading ${url}...`);
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    const writer = createWriteStream(targetPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
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
