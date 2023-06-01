const dotenv = require('dotenv')
const {CONFIG_CONSTANTS} = require("../constants/path.constants");
const {overWriteFileContents} = require("../utils/file.utils");
const {stringifyJavaScriptObjectToConfigFormat} = require("../utils/string.utils")
const logger = require("../utils/logger.utils");
const fs = require("fs")
const moment = require('moment-timezone');

/**
 * Parse the configuration file with given path
 * @param path
 * @returns {DotenvConfigOutput}
 */
const parseConfigurationFile = (path) => {
    return dotenv.config({path})
}

/**
 * Write a key, value pair to the configuration file
 * @param key
 * @param value
 * @returns {Promise<void>}
 */
const writeValueToConfigurationFile = async (key, value) => {
    //const latestDotEnvConfig = parseConfigurationFile(CONFIG_CONSTANTS().USER_CONFIG)
    //console.log(key)

    //const newDotEnv = {
      //  ...latestDotEnvConfig.parsed,
        //[key]: value
    //};

    //const dotEnvResult = stringifyJavaScriptObjectToConfigFormat(newDotEnv);
    //await overWriteFileContents(CONFIG_CONSTANTS().USER_CONFIG,  dotEnvResult)


    const data = fs.readFileSync('config.json');
  const json = JSON.parse(data);

    const newConfigvar = {
        ...json,
        [key]: value
    }

      // Write updated object back to file
      fs.writeFileSync('config.json', JSON.stringify(newConfigvar, null, 2));

}

/**
 * Copy sample-config.conf if config.conf does not exist
 * @returns {Promise<void>}
 */
const createNewUserConfigFromDefault = async () => {
  await copyFile(CONFIG_CONSTANTS().DEFAULT_CONFIG, CONFIG_CONSTANTS().USER_CONFIG);
  console.log('A new user config file was generated from the default file');
}

module.exports = {
    parseConfigurationFile,
    writeValueToConfigurationFile,
    createNewUserConfigFromDefault
}
