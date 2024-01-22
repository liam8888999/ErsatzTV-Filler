const { CONFIG_CONSTANTS } = require("../constants/path.constants");
const { doesFileExist, loadFileContentsIntoMemory } = require("../utils/file.utils");
const { parseConfigurationFile, createNewUserConfigFromDefault } = require("../utils/config.utils");
const fs = require('fs');
const fsPromises = fs.promises;
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
    CURRENT_CONFIG = await parseConfigurationFile(path).parsed;
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
const config = await retrieveCurrentConfiguration2();
const FILE_EXISTS = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG)
if (!FILE_EXISTS) {
  logger.error('The config.json file does not exist.');
  await fs.writeFile(CONFIG_CONSTANTS().USER_CONFIG, JSON.stringify(CONFIG_CONSTANTS().DEFAULT_CONFIG, null, 2), (err) => {
    if (err) {
      logger.error(`Error creating user config file: ${err}`);
    } else {
    logger.success('Created config.json file');
  };
});
}
}

const retrieveCurrentConfiguration = async () => {
  const configFileExists = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);
  const defaultConfigFileExists = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);
  await addKeyValuesToconfigFile();
  if (!configFileExists) {
    logger.warn("config.json file is missing... Generating a new copy");
    await jsonifyCurrentConfiguration();
} else {
    logger.info("Found a user configuration file... loading...");
  //  await retrieveCurrentConfiguration2()
  }

    const data = await fs.readFileSync(CONFIG_CONSTANTS().USER_CONFIG);
    CURRENT_CONFIG = JSON.parse(data);
    //(async () => { const config = await retrieveCurrentConfiguration(); logger.success(`Current config is: ${CURRENT_CONFIG}`)})()
return CURRENT_CONFIG;
};


async function addKeyValuesToconfigFile() {
  const filename = CONFIG_CONSTANTS().USER_CONFIG;

  const keyValuesToAdd = [
    {
      key: 'shownewsheader',
      value: 'yes',
    },
    {
      key: 'newsheadertext',
      value: 'Top News Stories',
    },
    {
      key: 'weatherduration',
      value: '30',
    },
    {
      key: 'vanitycardduration',
      value: '30',
    },
    {
      key: 'underlinenewsheader',
      value: 'yes',
    },
    {
      key: 'processchannellogo',
      value: 'yes',
    },
    {
      key: 'channellogovideofadeoutduration',
      value: '5',
    },
    {
      key: 'channellogovideofadeinduration',
      value: '5',
    },
    {
      key: 'channellogoaudiofadeoutduration',
      value: '5',
    },
    {
      key: 'channellogoaudiofadeinduration',
      value: '5',
    },
    {
      key: 'channellogointerval',
      value: '10',
    },
    {
      key: 'readnews',
      value: 'no',
    },
    {
      key: 'readonlynewsheadings',
      value: 'yes',
    },
    {
      key: 'weatherheader',
      value: 'Current Weather',
    },
    {
      key: 'showweatherheader',
      value: 'false',
    },
    {
      key: 'newsreadintro',
      value: '',
    },
    {
      key: 'newsreadoutro',
      value: '',
    },
    {
      key: 'audiolanguage',
      value: 'en',
    },
    {
      key: 'temperatureunits',
      value: '',
    },
    {
      key: 'country',
      value: 'us',
    },
    {
      key: 'usewttrin',
      value: 'no',
    },
    {
      key: 'booked_code',
      value: '',
    },
    {
      key: 'readweather',
      value: 'yes'
    },
    {
      key: 'cutomweathereaderscript',
      value: ''
    }
  ];

  try {
    // Read the JSON file with the 'utf8' encoding using fs.promises
    const data = await fsPromises.readFile(filename, 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Loop through the key/value pairs to add
    for (const { key, value } of keyValuesToAdd) {
      // Check if the key already exists in the JSON object
      if (!jsonData.hasOwnProperty(key)) {
        // If it doesn't exist, add the new key/value pair
        jsonData[key] = value;
      } else {
        logger.info(`Key '${key}' already exists in the JSON object.`);
      }
    }

    // Convert the updated data back to JSON string
    const updatedData = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON data back to the file using fs.promises
    await fsPromises.writeFile(filename, updatedData);

    logger.success('Key/value pairs added successfully.');
  } catch (err) {
    logger.error(err);
  }
}



//async log
//(async () => { const config = await retrieveCurrentConfiguration(); logger.info(config)})()


module.exports = {
    setupConfigurationFile,
    retrieveCurrentConfiguration,
}
