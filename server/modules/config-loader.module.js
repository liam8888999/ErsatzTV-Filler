const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const { doesFileExist, loadFileContentsIntoMemory } = require("../utils/file.utils");
const { parseConfigurationFile } = require("../utils/config.utils");

let CURRENT_CONFIG = {}; //In memory store for config data

const setupConfigurationFile = async () => {
    //For now, check exists and just load the user one over the default one... can be expanded to control your variable updating, and it will always run on server boot.
    const HAVE_USER_CONFIG = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);
    if(!HAVE_USER_CONFIG){
        console.warn("Can not find a user configuration file... loading default...")
        await parseConfigurationFileContents(CONFIG_CONSTANTS().DEFAULT_CONFIG)
    }else{
        console.log("Found a user configuration file... loading...")
        await parseConfigurationFileContents(CONFIG_CONSTANTS().USER_CONFIG)
    }
}

const parseConfigurationFileContents = async (path) => {
    CURRENT_CONFIG = parseConfigurationFile(path);
}

module.exports = {
    setupConfigurationFile,
    CURRENT_CONFIG
}