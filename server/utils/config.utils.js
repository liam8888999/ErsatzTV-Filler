const dotenv = require('dotenv')
const {CONFIG_CONSTANTS} = require("../constants/path.constants");
const {overWriteFileContents} = require("../utils/file.utils");
const {stringifyJavaScriptObjectToConfigFormat} = require("../utils/string.utils")
const fs = require("fs")
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module")

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
    json[key] = value;

      // Write updated object back to file
      fs.writeFileSync('config.json', JSON.stringify(json, null, 2));

}



async function settheme(theme) {
  try {
    const fileData = await fs.promises.readFile("config.json");
    const json = JSON.parse(fileData);
    json.theme = theme;
    await fs.promises.writeFile("config.json", JSON.stringify(json, null, 2));
    console.log(`Successfully updated theme to '${theme}' in config.conf`);
  } catch (err) {
    console.error(`Error updating theme to '${theme}' in config.json: ${err}`);
  }
}


module.exports = {
    parseConfigurationFile,
    writeValueToConfigurationFile,
    settheme
}
