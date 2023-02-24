const { readFile, stat, copyFile, writeFile, readdir } = require('fs').promises; //Loads the asynchronous version of fs
const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const path = require('path')
const fs = require('fs')



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
        console.error(e)
    }

}

function listFilesInDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fileList = [];

  files.forEach(file => {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      fileList = fileList.concat(listFiles(filePath));
    } else {
      fileList.push(filePath);
    }
  });
console.log(fileList)
  return fileList;
}


module.exports = {
    doesFileExist,
    loadFileContentsIntoMemory,
    overWriteFileContents,
    listFilesInDir
}
