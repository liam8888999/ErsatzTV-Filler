const { readFile, stat, copyFile, writeFile, readdir } = require('fs').promises; //Loads the asynchronous version of fs
const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const path = require('path')
const fs = require('fs')
const logger = require("../utils/logger.utils");
const sizeOf = require("image-size");




/**
 * Returns the contents of a file from the local system. Requires a relative path passing through!
 * @param path
 * @returns {Promise<Buffer>}
 */
const loadFileContentsIntoMemory = async (path) => {
    const data = await readFile(path, "binary");
    return Buffer.from(data);
}
/**
 * Returns true/false on existence of file
 * @param path
 * @returns {Promise<*>}
 */

const doesFileExist = async (path) => {
    let result;
    try{
        result = await stat(path);// !! is a truthy check, so it checks if the value is not null, undefined, nan or -1
    }catch (e) {
        result = false;
    }
    return result;
}


/**
 * Overwrite the contents of an existing file... currently easiest way I know of updating the local file with changes.
 * @param path
 * @param fileContents
 * @returns {Promise<void>}
 */
const overWriteFileContents = async (path, fileContents) => {
    try{
        await writeFile(path, fileContents);
    }catch(e){
        logger.error(`Error overwriting file contents: ${e}`)
    }

}

async function listFilesInDir(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const filePromises = files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        if (!file.startsWith('.')) { // Ignore hidden directories
          const subFiles = await listFilesInDir(filePath); // Recursive call
          return subFiles;
        }
      } else {
        if (!file.startsWith('.')) { // Ignore hidden files
          return filePath;
        }
      }
    });

    const results = await Promise.all(filePromises);
    return results.flat().filter(Boolean); // Remove undefined values
  } catch (error) {
    logger.error(`Error reading directory for directory listing: ${error}`);
    return [];
  }
}


const createDirectoryIfNotExists = (directoryPath) => {
  if (directoryPath && directoryPath.trim() !== '') {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    logger.success(`Directory created: ${directoryPath}`);
  } else {
    logger.warn(`Directory already exists, will not be created: ${directoryPath}`);
  }
}
};

function getImageWidthHeight(image, videoresolution) {
  let calcHW = {
    vWidth: videoresolution.toLowerCase().split('x')[0] - 30,
    vHeight: '-1'
  };
  try {
    const dimensions = sizeOf.imageSize(image);
    let resWidth = videoresolution.toLowerCase().split('x')[0];
    let resHeight = videoresolution.toLowerCase().split('x')[1];
    if (resWidth / dimensions.width * dimensions.height > resHeight) {
      calcHW.vWidth = '-1';
      calcHW.vHeight = videoresolution.toLowerCase().split('x')[1] - 20;
    }
  } catch (e) {
    logger.error('Image size Detection Failed For ' + image);
  }
  return calcHW;
}

module.exports = {
    doesFileExist,
    loadFileContentsIntoMemory,
    overWriteFileContents,
    listFilesInDir,
    createDirectoryIfNotExists,
    getImageWidthHeight
}
