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
    //logger.info(key)

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
   await fs.writeFile(CONFIG_CONSTANTS().USER_CONFIG, JSON.stringify(CONFIG_CONSTANTS().DEFAULT_CONFIG, null, 2), (err) => {
     if (err) {
       logger.error('Error creating user config file:', err);
     } else {
       logger.success('A new user config file was generated from the default file');
     }
   });
 };

const setwebtheme = async (theme) => {
  try {
    const fileData = await fs.readFileSync("config.json");
    const json = JSON.parse(fileData);
    json.webtheme = theme;
    await fs.writeFileSync("config.json", JSON.stringify(json, null, 2));
    logger.success(`Successfully updated webtheme to '${theme}' in config.json`);
  } catch (err) {
    logger.error(`Error updating webtheme to '${theme}' in config.json: ${err}`);
  }
}

module.exports = {
    parseConfigurationFile,
    writeValueToConfigurationFile,
    createNewUserConfigFromDefault,
    setwebtheme
}
