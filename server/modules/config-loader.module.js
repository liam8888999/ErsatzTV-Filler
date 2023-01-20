const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const { doesFileExist, createNewUserConfigFromDefault } = require("../utils/file.utils");
const { parseConfigurationFile } = require("../utils/config.utils");

let CURRENT_CONFIG = {}; //In memory store for config data

/**
 * Boot taks to setup the configuration file or load the users current one
 * @returns {Promise<void>}
 */
const setupConfigurationFile = async () => {
    //For now, check exists and just load the user one over the default one... can be expanded to control your variable updating, and it will always run on server boot.
    const HAVE_USER_CONFIG = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);
    if(!HAVE_USER_CONFIG){
        console.warn("Can not find a user configuration file... loading default...")
        await parseConfigurationFileContents(CONFIG_CONSTANTS().DEFAULT_CONFIG)
        await createNewUserConfigFromDefault();
    }else{
        console.log("Found a user configuration file... loading...")
        await parseConfigurationFileContents(CONFIG_CONSTANTS().USER_CONFIG)
    }
}

/**
 * Given a path of a configuration file, it will parse into CURRENT_CONFIG the config key and value pairs
 * @param path
 * @returns {Promise<void>}
 */
const parseConfigurationFileContents = async (path) => {
    CURRENT_CONFIG = parseConfigurationFile(path).parsed;
    console.log(parseConfigurationFile(path).parsed)
}

/**
 * Return the current configuration as a object
 * @returns {{}}
 */
const retrieveCurrentConfiguration = () => {
    return CURRENT_CONFIG
}

module.exports = {
    setupConfigurationFile,
    retrieveCurrentConfiguration
}
