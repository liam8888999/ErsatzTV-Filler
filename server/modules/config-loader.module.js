const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const { doesFileExist, loadFileContentsIntoMemory } = require("../utils/file.utils");
const { parseConfigurationFile, createNewUserConfigFromDefault } = require("../utils/config.utils");
const fs = require('fs');
const logger = require("../utils/logger.utils");



let CURRENT_CONFIG = {}; //In memory store for config data

/**
 * Boot taks to setup the configuration file or load the users current one
 * @returns {Promise<void>}
 */
const setupConfigurationFile = async () => {
    //For now, check exists and just load the user one over the default one... can be expanded to control your variable updating, and it will always run on server boot.
    const HAVE_USER_CONFIG = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);
    if(!HAVE_USER_CONFIG){
        logger.warn("Can not find a user configuration file... loading default...")
        await parseConfigurationFileContents(CONFIG_CONSTANTS().DEFAULT_CONFIG)
        await createNewUserConfigFromDefault();
    }else{
        logger.success("Found a user configuration file... loading...")
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
  //  logger.info(CURRENT_CONFIG)
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
  logger.error('The config.json file does not exist.');
// Delete autoupdate key-value pair from json before writing to file
delete config.log_per_run;
//logger.info(config);
delete config.autoupdate;
delete config.textspeed;
config.webport = '8408';
config.webtheme = 'light';
config.fontfile = 'fonts/Verdana.tff';
config.newsarticles = '10';
config.processxmltvmerger = 'no';
config.epg1 = '';
config.epg2 = '';
//logger.info(config);
  // Convert the JSON object to a string with each key-value pair on a single line
  const jsonString = JSON.stringify(config, null, 2);

  // Write the JSON string to a file named "output.json"
  fs.writeFile('config.json', jsonString, (err) => {
    //see how it goes with the logger
    if (err) { throw err;
     logger.error(err);
   }
    logger.success('Created config.json file');
  });
}

}

const retrieveCurrentConfiguration = async () => {
  const configFileExists = await doesFileExist("config.json");
  const defaultConfigFileExists = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);

  if (!configFileExists && defaultConfigFileExists) {
    logger.warn("config.json file is missing... Generating a new copy");
    await jsonifyCurrentConfiguration();
  } else if (!configFileExists && !defaultConfigFileExists) {
    logger.warn("Both config.json and default configuration file are missing. Building new config.json");
  await setupConfigurationFile(); // Create new config.json from default configuration
  } else if (configFileExists && !defaultConfigFileExists) {
    logger.warn("Both config.json and default configuration file are missing. Building new config.json");
    await createNewUserConfigFromDefault(); // Create new config.json from default configuration
  } else {
    logger.info("Found a user configuration file... loading...");
    await retrieveCurrentConfiguration2()
  }

    const data = await loadFileContentsIntoMemory('config.json');
   return JSON.parse(data)
};




//async log
//(async () => { const config = await retrieveCurrentConfiguration(); logger.info(config)})()


module.exports = {
    setupConfigurationFile,
    retrieveCurrentConfiguration,
}
