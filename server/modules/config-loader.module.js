const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const { doesFileExist, loadFileContentsIntoMemory } = require("../utils/file.utils");
const { parseConfigurationFile, createNewUserConfigFromDefault } = require("../utils/config.utils");
const fs = require('fs');
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');

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
    await jsonifyCurrentConfiguration();
}

/**
 * Given a path of a configuration file, it will parse into CURRENT_CONFIG the config key and value pairs
 * @param path
 * @returns {Promise<void>}
 */
const parseConfigurationFileContents = async (path) => {
    CURRENT_CONFIG = parseConfigurationFile(path).parsed;
    console.log(CURRENT_CONFIG)
}


/**
 * Return the current configuration as a object
 * @returns {{}}
 */
const retrieveCurrentConfiguration2 = () => {
    return CURRENT_CONFIG
}

const jsonifyCurrentConfiguration = async () => {

  // convert config.conf to config.json  -- Delete config.conf totally in future versions
const config = retrieveCurrentConfiguration2();
const FILE_EXISTS = await doesFileExist("config.json")
if (!FILE_EXISTS) {
  console.log('The config.json file does not exist.');
// Delete autoupdate key-value pair from json before writing to file
    delete config.autoupdate;
  // Convert the JSON object to a string with each key-value pair on a single line
  const jsonString = JSON.stringify(config, null, 2);

  // Write the JSON string to a file named "output.json"
  fs.writeFile('config.json', jsonString, (err) => {
    //see how it goes with the logger
    if (err) { throw err;
     logger.error(err);
   }
    console.log('Created config.json file');
  });
}

}

const retrieveCurrentConfiguration = async () => {

    const data = await loadFileContentsIntoMemory('config.json')
return JSON.parse(data)
}

//async log
//(async () => { const config = await retrieveCurrentConfiguration(); console.log(config)})()


module.exports = {
    setupConfigurationFile,
    retrieveCurrentConfiguration,
}
