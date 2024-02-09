const dotenv = require('dotenv')
const {CONFIG_CONSTANTS} = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const fs = require("fs")

//Only one value but can't be changed if not an object
//This is set to true if writeValueToConfigurationFile is called
let configStatus = {
  changed: false
};

/**
 * Parse the configuration file with given path
 * @param path
 * @returns DotenvConfigOutput
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
  const data = await fs.readFileSync(CONFIG_CONSTANTS().USER_CONFIG);
  const json = JSON.parse(data);

  value = value.trim();
  value = value.toLowerCase() === 'yes' ? 'yes' : value;
  const newConfigvar = {
    ...json,
    [key]: value
  }

  // Write updated object back to file
  await fs.writeFileSync(`${CONFIG_CONSTANTS().USER_CONFIG}`, JSON.stringify(newConfigvar, null, 2));
  configStatus.changed = true;
}

const configUpdated = () => {
  configStatus.changed = false;
}

const configChanged = () => {
  return configStatus.changed;
}
/**
 * Copy sample-config.conf if config.conf does not exist
 * @returns {Promise<void>}
 */
const createNewUserConfigFromDefault = async () => {
  await fs.writeFile(CONFIG_CONSTANTS().USER_CONFIG, JSON.stringify(CONFIG_CONSTANTS().DEFAULT_CONFIG, null, 2), (err) => {
    if (err) {
      logger.error(`Error creating user config file: ${err}`);
    } else {
      logger.success('A new user config file was generated from the default file');
    }
  });
};

const setWebTheme = async (theme) => {
  try {
    const fileData = await fs.readFileSync(CONFIG_CONSTANTS().USER_CONFIG);
    const json = JSON.parse(fileData);
    json.webtheme = theme;
    await fs.writeFileSync(CONFIG_CONSTANTS().USER_CONFIG, JSON.stringify(json, null, 2));
    logger.success(`Successfully updated webtheme to '${theme}' in config.json`);
  } catch (err) {
    logger.error(`Error updating webtheme to '${theme}' in config.json: ${err}`);
  }
}

module.exports = {
  parseConfigurationFile,
  writeValueToConfigurationFile,
  createNewUserConfigFromDefault,
  setWebTheme,
  configChanged,
  configUpdated,
}
