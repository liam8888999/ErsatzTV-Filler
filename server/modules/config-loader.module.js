const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const { doesFileExist, createNewUserConfigFromDefault } = require("../utils/file.utils");
const { parseConfigurationFile } = require("../utils/config.utils");

let CURRENT_CONFIG = {}; //In memory store for config data

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

const parseConfigurationFileContents = async (path) => {
    console.log(parseConfigurationFile(path).parsed)
    CURRENT_CONFIG = parseConfigurationFile(path).parsed;
    console.log(CURRENT_CONFIG)
}

module.exports = {
    setupConfigurationFile,
    CURRENT_CONFIG
}
