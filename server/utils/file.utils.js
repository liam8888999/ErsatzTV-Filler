const { readFile } = require('fs').promises;

/**
 * Returns the contents of a file from the local system. Requires a relative path passing through!
 * @param path
 * @returns {Promise<Buffer>}
 */
const loadFileContentsIntoMemory = async (path) => {
    const data = await readFile("/"+path, "binary");
    return Buffer.from(data);
}