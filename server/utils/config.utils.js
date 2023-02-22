const dotenv = require('dotenv')
const {CONFIG_CONSTANTS} = require("../constants/path.constants");
const {overWriteFileContents} = require("../utils/file.utils");
const {stringifyJavaScriptObjectToConfigFormat} = require("../utils/string.utils")
const fs = require("fs")

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

const settheme = () => {


  try {
    // Read the JSON file into memory
    let jsonString = fs.readFileSync('config.json');
  console.log('File read successfully!');
} catch (error) {
  console.error('Error Reading file:', error);
}

// Parse the JSON string into a JavaScript object
let data = JSON.parse(jsonString);

// Modify the value
theme.name = '123';

// Convert the JavaScript object back into a JSON string
jsonString = JSON.stringify(data);

// Write the updated JSON back to the file
try {
  // Read the JSON file into memory
  fs.writeFileSync('config.json', jsonString);
console.log('File write successfully!');
} catch (error) {
console.error('Error writing file:', error);
}

}

module.exports = {
    parseConfigurationFile,
    writeValueToConfigurationFile,
    settheme
}
