const {CONFIG_CONSTANTS} = require("../constants/path.constants");
const {doesFileExist} = require("../utils/file.utils");
const {
  parseConfigurationFile,
  createNewUserConfigFromDefault,
  configChanged,
  configUpdated
} = require("../utils/config.utils");
const fs = require('fs');
const fsPromises = fs.promises;
const logger = require("../utils/logger.utils");
const {version} = require('../../package.json');

let CURRENT_CONFIG = {}; //In memory store for config data

/**
 * Boot takes to set up the configuration file or load the users current one
 * We take this opportunity to add any new variables and do version change cleanup
 * @returns {Promise<void>}
 */
const setupConfigurationFile = async () => {
  //For now, check exists and just load the user one over the default one... can be expanded to control your variable updating, and it will always run on server boot.
  const HAVE_USER_CONFIG = await doesFileExist(CONFIG_CONSTANTS().USER_CONFIG);
  if (!HAVE_USER_CONFIG) {
    logger.warn("Can not find a user configuration file... loading default...");
    await createNewUserConfigFromDefault();
  } else {
    logger.success("Found a user configuration file... loading...")
    await parseConfigurationFileContents(CONFIG_CONSTANTS().USER_CONFIG);
  }

  await addKeyValuesToConfigFile();
  await updateVariablesChangedInConfigFile();
}

/**
 * Given a path of a configuration file, it will parse into CURRENT_CONFIG the config key and value pairs
 * @param path
 * @returns {Promise<void>}
 */
const parseConfigurationFileContents = async (path) => {
  CURRENT_CONFIG = await parseConfigurationFile(path).parsed;
}

const retrieveCurrentConfiguration = async () => {
  if (Object.keys(CURRENT_CONFIG).length === 0 || configChanged()) {
    const data = await fs.readFileSync(CONFIG_CONSTANTS().USER_CONFIG);
    CURRENT_CONFIG = JSON.parse(data);
    configUpdated();
  }
  return CURRENT_CONFIG;
};


async function addKeyValuesToConfigFile() {
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
      key: 'customweatherreaderscript',
      value: ''
    }
  ];

  try {
    // Read the JSON file with the 'utf8' encoding using fs.promises
    const data = await fsPromises.readFile(filename, 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Loop through the key/value pairs to add
    for (const {key, value} of keyValuesToAdd) {
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

async function updateLatestVersionInconfigFile() {
  const filename = CONFIG_CONSTANTS().USER_CONFIG;

  try {
    // Read the JSON file with the 'utf8' encoding using fs.promises
    const data = await fsPromises.readFile(filename, 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Update the last ran version
    jsonData.latestversion = version;
    // Convert the updated data back to JSON string
    const updatedData = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON data back to the file using fs.promises
    await fsPromises.writeFile(filename, updatedData);

    logger.success('Latest version variable updated successfully.');
  } catch (err) {
    logger.error(err);
  }
}

async function updateVariablesChangedInConfigFile() {
  const filename = CONFIG_CONSTANTS().USER_CONFIG;

  try {
    // Read the JSON file with the 'utf8' encoding using fs.promises
    const data = await fsPromises.readFile(filename, 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    if ((typeof jsonData.latestversion === 'undefined' || jsonData.latestversion <= '1.10.1') && (typeof jsonData.cutomweathereaderscript !== 'undefined')) {
      jsonData.customweatherreaderscript = jsonData.cutomweathereaderscript
        .replaceAll('{{TODAY}}', '{{currentConditions.date}}')
        .replaceAll('{{TOMORROW}}', 'tomorrow')
        .replaceAll('{{DAY_THREE}}', '{{forecast.2.day}}')
        .replaceAll('{{OBSERVATION_TIME}}', '{{currentConditions.observation_time}}')
        .replaceAll('{{LOCAL_OBSERVATION_DATETIME}}', '{{currentConditions.observationDate}}')
        .replaceAll('{{CITY}}', '{{location.city}}')
        .replaceAll('{{STATE}}', '{{location.state}}')
        .replaceAll('{{COUNTRY}}', '{{location.country}}')
        .replaceAll('{{CURRENT_CONDITIONS}}', '{{currentConditions.conditions}}')
        .replaceAll('{{CURRENT_TEMP}}', '{{currentConditions.temp}}')
        .replaceAll('{{CURRENT_FEELSLIKE}}', '{{currentConditions.feelsLike}}')
        .replaceAll('{{CURRENT_CLOUDCOVER}}', '{{currentConditions.cloudcover}}')
        .replaceAll('{{CURRENT_HUMIDITY}}', '{{currentConditions.humidity}}')
        .replaceAll('{{CURRENT_PRESSURE}}', '{{currentConditions.pressure}}')
        .replaceAll('{{CURRENT_PRESSUREINCHES}}', '{{currentConditions.pressureInches}}')
        .replaceAll('{{CURRENT_UVINDEX}}', '{{currentConditions.uvIndex}}')
        .replaceAll('{{CURRENT_WIND_DIR_DEGREE}}', '{{currentConditions.winddirDegree}}')
        .replaceAll('{{CURRENT_WIND_DIR}}', '{{currentConditions.windDir}}')
        .replaceAll('{{CURRENT_WIND_SPEED}}', '{{currentConditions.windspeed}}')
        .replaceAll('{{LATITUDE}}', '{{location.latitude}}')
        .replaceAll('{{LONGITUDE}}', '{{location.longitude}}')
        .replaceAll('{{POPULATION}}', '{{location.population}}')
        .replaceAll('{{TODAY_AVERAGETEMP}}', '{{forecast.today.avgtemp}}')
        .replaceAll('{{TODAY_DATE}}', '{{forecast.today.date}}')
        .replaceAll('{{TODAY_MAXTEMP}}', '{{forecast.today.maxtemp}}')
        .replaceAll('{{TODAY_MINTEMP}}', '{{forecast.today.mintemp}}')
        .replaceAll('{{TODAY_SUNHOUR}}', '{{forecast.today.sunHour}}')
        .replaceAll('{{TODAY_TOTALSNOW_CM}}', '{forecast.today.totalSnow_cm}}')
        .replaceAll('{{TODAY_UVINDEX}}', '{forecast.today.uvIndex}}')
        .replaceAll('{{TODAY_MOON_ILLUMINATION}}', '{forecast.today.astronomy.moon_illumination}}')
        .replaceAll('{{TODAY_MOON_PHASE}}', '{forecast.today.astronomy.moon_phase}}')
        .replaceAll('{{TODAY_MOONRISE}}', '{forecast.today.astronomy.moonrise}}')
        .replaceAll('{{TODAY_MOONSET}}', '{forecast.today.astronomy.moonset}}')
        .replaceAll('{{TODAY_SUNRISE}}', '{forecast.today.astronomy.sunrise}}')
        .replaceAll('{{TODAY_SUNSET}}', '{forecast.today.astronomy.sunset}}')
        .replaceAll('{{TOMORROW_AVERAGETEMP}}', '{{forecast.1.avgtemp}}')
        .replaceAll('{{TOMORROW_DATE}}', '{{forecast.1.date}}')
        .replaceAll('{{TOMORROW_MAXTEMP}}', '{{forecast.1.maxtemp}}')
        .replaceAll('{{TOMORROW_MINTEMP}}', '{{forecast.1.mintemp}}')
        .replaceAll('{{TOMORROW_SUNHOUR}}', '{{forecast.1.sunHour}}')
        .replaceAll('{{TOMORROW_TOTALSNOW_CM}}', '{{forecast.1.totalSnow_cm}}')
        .replaceAll('{{TOMORROW_UVINDEX}}', '{{forecast.1.uvIndex}}')
        .replaceAll('{{TOMORROW_MOON_ILLUMINATION}}', '{{forecast.1.astronomy.moon_illumination}}')
        .replaceAll('{{TOMORROW_MOON_PHASE}}', '{{forecast.1.astronomy.moon_phase}}')
        .replaceAll('{{TOMORROW_MOONRISE}}', '{{forecast.1.astronomy.moonrise}}')
        .replaceAll('{{TOMORROW_MOONSET}}', '{{forecast.1.astronomy.moonset}}')
        .replaceAll('{{TOMORROW_SUNRISE}}', '{{forecast.1.astronomy.sunrise}}')
        .replaceAll('{{TOMORROW_SUNSET}}', '{{forecast.1.astronomy.sunset}}')
        .replaceAll('{{DAY_THREE_AVERAGETEMP}}', '{{forecast.2.avgtemp}}')
        .replaceAll('{{DAY_THREE_DATE}}', '{{forecast.2.date}}')
        .replaceAll('{{DAY_THREE_MAXTEMP}}', '{{forecast.2.maxtemp}}')
        .replaceAll('{{DAY_THREE_MINTEMP}}', '{{forecast.2.mintemp}}')
        .replaceAll('{{DAY_THREE_SUNHOUR}}', '{{forecast.2.sunHour}}')
        .replaceAll('{{DAY_THREE_TOTALSNOW_CM}}', '{{forecast.2.totalSnow_cm}}')
        .replaceAll('{{DAY_THREE_UVINDEX}}', '{{forecast.2.uvIndex}}')
        .replaceAll('{{DAY_THREE_MOON_ILLUMINATION}}', '{{forecast.2.astronomy.moon_illumination}}')
        .replaceAll('{{DAY_THREE_MOON_PHASE}}', '{{forecast.2.astronomy.moon_phase}}')
        .replaceAll('{{DAY_THREE_MOONRISE}}', '{{forecast.2.astronomy.moonrise}}')
        .replaceAll('{{DAY_THREE_MOONSET}}', '{{forecast.2.astronomy.moonset}}')
        .replaceAll('{{DAY_THREE_SUNRISE}}', '{{forecast.2.astronomy.sunrise}}')
        .replaceAll('{{DAY_THREE_SUNSET}}', '{{forecast.2.astronomy.sunset}}')

      // Delete the old key    -- Error currently when key gets deleted
      delete jsonData.cutomweathereaderscript;

      // Convert the updated data back to JSON string
      const updatedData = JSON.stringify(jsonData, null, 2);

      // Write the updated JSON data back to the file using fs.promises
      await fsPromises.writeFile(filename, updatedData);
    }


    await updateLatestVersionInconfigFile();

    logger.success('Updated changed variables in config.');
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
