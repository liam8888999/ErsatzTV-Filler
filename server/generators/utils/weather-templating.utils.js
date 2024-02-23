const fs = require("fs");
const logger = require("../../utils/logger.utils");
const {retrieveCurrentConfiguration} = require("../../modules/config-loader.module");
const path = require("path");
const {WEATHERDIR, DEFAULT_WEATHER_SCRIPT} = require("../../constants/path.constants");
const Mustache = require("mustache");

//Thinking of future expansion, first of all a collection of templates that can be selected
//purposefully or randomly. 
const currentTemplate = async () => {
  const config_current = await retrieveCurrentConfiguration();
  let script;
  script = `${DEFAULT_WEATHER_SCRIPT}`
  if (config_current.customweatherreaderscript.length > 0) {
    script = `${config_current.customweatherreaderscript}`
  }
  return script;
}

const weatherTemplateReplacement = async (script) => {
  const config_current = await retrieveCurrentConfiguration();
  let weatherData;
  await fs.promises.readFile(`${path.join(WEATHERDIR, 'weather2.json')}`, 'utf8')
    .then(data => {
      weatherData = JSON.parse(data);
      logger.debug(weatherData);
    })
    .catch(error => {
      logger.error(error);
    });
  const outputData = weatherTemplateData(weatherData, config_current);
  return Mustache.render(script, outputData);
}

function weatherTemplateData(inputJSON, config_current) {
  let weatherData = {
    currentConditions: {},
    location: {},
    forecast: {},
    units: {}
  };
  let values;
  let speed = config_current.temperatureunits.toLowerCase() === 'fahrenheit' ? 'Miles' : 'Kmph';
  let degree = config_current.temperatureunits.toLowerCase() === 'fahrenheit' ? 'F' : 'C';
  let depth = config_current.temperatureunits.toLowerCase() === 'fahrenheit' ? 'Inches' : 'mm';

  //output some units if people want to use them
  weatherData.units.temperature = config_current.temperatureunits;
  weatherData.units.speed = speed;
  weatherData.units.depth = depth;
  weatherData.header = config_current.weatherheader;

  for (let section in inputJSON) {
    switch (section) {
      case 'current_condition':
        values = inputJSON[section][0];
        for (let valKey in values) {
          //In general, we're locating the local values and outputting as the default
          switch (valKey) {
            case 'localObsDateTime':
              //create some different date formats
              const obsDate = new Date(Date.parse(values[valKey]));
              weatherData.currentConditions.observationDate = obsDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              });
              weatherData.currentConditions.day = obsDate.toLocaleDateString('en-US', {weekday: 'long'});
              weatherData.currentConditions.date = obsDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              break;
            case 'weatherDesc':
              weatherData.currentConditions.conditions = values[valKey][0].value;
              break;
            case 'FeelsLike' + degree:
              weatherData.currentConditions.feelsLike = values[valKey];
              break;
            case 'precip' + depth:
              weatherData.currentConditions.precip = values[valKey];
              break;
            case 'pressure' + depth:
              weatherData.currentConditions.pressure = values[valKey];
              break;
            case 'temp_' + degree:
              weatherData.currentConditions.temp = values[valKey];
              break;
            case 'visibility' + speed:
              weatherData.currentConditions.visibility = values[valKey];
              break;
            case 'winddir16Point':
              weatherData.currentConditions.windDir = values[valKey]
                .replaceAll('N', 'north ')
                .replaceAll('E', 'east ')
                .replaceAll('S', 'south ')
                .replaceAll('W', 'west ');
              break;
            case 'windspeed' + speed:
              weatherData.currentConditions.windspeed = values[valKey];
              break;
            default:
              //Keep everything even if we don't process it.  Just dump it direct
              weatherData.currentConditions[valKey] = values[valKey];
          }
        }
        break;
      case 'nearest_area':
        values = inputJSON[section][0];
        for (let valKey in values) {
          switch (valKey) {
            case 'areaName':
              weatherData.location.city = values[valKey][0].value;
              break;
            case'region':
              weatherData.location.state = values[valKey][0].value;
              break;
            case 'country':
              weatherData.location.country = values[valKey][0].value;
              break;
            case 'weatherUrl':
              break;
            default:
              weatherData.location[valKey] = values[valKey];
          }
        }
        break;
      case 'weather':
        values = inputJSON[section];
        values.forEach((forecast, index) => {
          //Mustache can do things with arrays but not how we want to so convert
          //all of this to a list of objects.  Today, 1 = tomorrow, 2 = the following day
          const dayInd = index === 0 ? 'today' : index;
          weatherData.forecast[dayInd] = {};
          const destData = weatherData.forecast[dayInd];
          for (let valKey in forecast) {
            switch (valKey) {
              case 'astronomy':
                destData['astronomy'] = forecast['astronomy'][0];
                break;
              case 'avgtemp' + degree:
                destData.avgtemp = forecast['avgtemp' + degree];
                break;
              case 'date':
                let fDate = new Date(Date.parse(forecast['date']));
                destData.date = fDate.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
                destData.day = fDate.toLocaleDateString('en-US', {weekday: 'long'});
                break;
              case 'maxtemp' + degree:
                destData.maxtemp = forecast['maxtemp' + degree];
                break;
              case 'mintemp' + degree:
                destData.mintemp = forecast['mintemp' + degree];
                break;
              default:
                destData[valKey] = forecast[valKey];
                break;
            }
          }
        });
        break;
      default:
        //Again, if any top level parameters exist, just dump them in whole to the output
        weatherData[section] = inputJSON[section];
    }
  }
  return weatherData;
}

module.exports = {
  weatherTemplateReplacement, weatherTemplateData, currentTemplate
};
