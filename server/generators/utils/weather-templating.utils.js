const fs = require("fs");
const logger = require("../../utils/logger.utils");
const {retrieveCurrentConfiguration} = require("../../modules/config-loader.module");
const path = require("path");
const {WEATHERDIR} = require("../../constants/path.constants");

const weathertemplatereplacement = async (script) => {
  const config_current = await retrieveCurrentConfiguration();
  let weatherData;
  let speed = config_current.temperatureunits.toLowerCase() === 'fahrenheit' ? 'Miles' : 'Kmph';
  let degree = config_current.temperatureunits.toLowerCase() === 'fahrenheit' ? 'F' : 'C';
  let dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let obsDate;
  let today;
  let dateThree;
  let windDir;
  await fs.promises.readFile(`${path.join(WEATHERDIR, 'weather2.json')}`, 'utf8')
    .then(data => {
      weatherData = JSON.parse(data);
      logger.debug(weatherData);
    })
    .catch(error => {
      logger.error(error);
    });
  obsDate = new Date();
  today = obsDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  dateThree = new Date();
  dateThree.setDate(obsDate.getDate() + 2);
  windDir = weatherData.current_condition[0].winddir16Point;
  windDir = windDir
    .replaceAll('N', 'north')
    .replaceAll('E', 'east')
    .replaceAll('S', 'south')
    .replaceAll('W', 'west');

  script = script
    .replaceAll('{{TODAY}}', today)
    .replaceAll('{{TOMORROW}}', 'Tomorrow')
    .replaceAll('{{DAY_THREE}}', dayName[dateThree.getDay()])
    .replaceAll('{{OBSERVATION_TIME}}', weatherData.current_condition[0].observation_time)
    .replaceAll('{{LOCAL_OBSERVATION_DATETIME}}', weatherData.current_condition[0].localObsDateTime)
    .replaceAll('{{WEATHER_HEADER}}', config_current.weatherheader)
    .replaceAll('{{CITY}}', weatherData.nearest_area[0].areaName[0].value)
    .replaceAll('{{STATE}}', weatherData.nearest_area[0].region[0].value)
    .replaceAll('{{COUNTRY}}', weatherData.nearest_area[0].country[0].value)
    .replaceAll('{{CURRENT_CONDITIONS}}', weatherData.current_condition[0].weatherDesc[0].value)
    .replaceAll('{{CURRENT_TEMP}}', weatherData.current_condition[0]['temp_' + degree])
    .replaceAll('{{CURRENT_FEELSLIKE}}', weatherData.current_condition[0]['FeelsLike' + degree])
    .replaceAll('{{CURRENT_CLOUDCOVER}}', weatherData.current_condition[0].cloudcover)
    .replaceAll('{{CURRENT_HUMIDITY}}', weatherData.current_condition[0].humidity)
    .replaceAll('{{CURRENT_PRESSURE}}', weatherData.current_condition[0].pressure)
    .replaceAll('{{CURRENT_PRESSUREINCHES}}', weatherData.current_condition[0].pressureinches)
    .replaceAll('{{CURRENT_UVINDEX}}', weatherData.current_condition[0].uvIndex)
    .replaceAll('{{CURRENT_WIND_DIR_DEGREE}}', weatherData.current_condition[0].winddirDegree)
    .replaceAll('{{CURRENT_WIND_DIR}}', windDir)
    .replaceAll('{{CURRENT_WIND_SPEED}}', weatherData.current_condition[0]['windspeed' + speed])
    .replaceAll('{{LATITUDE}}', weatherData.nearest_area[0].latitude)
    .replaceAll('{{LONGITUDE}}', weatherData.nearest_area[0].longitude)
    .replaceAll('{{POPULATION}}', weatherData.nearest_area[0].population)
    .replaceAll('{{TODAY_AVERAGETEMP}}', weatherData.weather[0]['avgtemp' + degree])
    .replaceAll('{{TODAY_DATE}}', weatherData.weather[0].date)
    .replaceAll('{{TODAY_MAXTEMP}}', weatherData.weather[0]['maxtemp' + degree])
    .replaceAll('{{TODAY_MINTEMP}}', weatherData.weather[0]['mintemp' + degree])
    .replaceAll('{{TODAY_SUNHOUR}}', weatherData.weather[0].sunHour + "hours")
    .replaceAll('{{TODAY_TOTALSNOW_CM}}', weatherData.weather[0].totalSnow_cm)
    .replaceAll('{{TODAY_UVINDEX}}', weatherData.weather[0].uvIndex)
    .replaceAll('{{TODAY_MOON_ILLUMINATION}}', weatherData.weather[0].astronomy[0].moon_illumination)
    .replaceAll('{{TODAY_MOON_PHASE}}', weatherData.weather[0].astronomy[0].moon_phase)
    .replaceAll('{{TODAY_MOONRISE}}', weatherData.weather[0].astronomy[0].moonrise)
    .replaceAll('{{TODAY_MOONSET}}', weatherData.weather[0].astronomy[0].moonset)
    .replaceAll('{{TODAY_SUNRISE}}', weatherData.weather[0].astronomy[0].sunrise)
    .replaceAll('{{TODAY_SUNSET}}', weatherData.weather[0].astronomy[0].sunset)
    .replaceAll('{{TOMORROW_AVERAGETEMP}}', weatherData.weather[1]['avgtemp' + degree])
    .replaceAll('{{TOMORROW_DATE}}', weatherData.weather[1].date)
    .replaceAll('{{TOMORROW_MAXTEMP}}', weatherData.weather[1]['maxtemp' + degree])
    .replaceAll('{{TOMORROW_MINTEMP}}', weatherData.weather[1]['mintemp' + degree])
    .replaceAll('{{TOMORROW_SUNHOUR}}', weatherData.weather[1].sunHour + "hours")
    .replaceAll('{{TOMORROW_TOTALSNOW_CM}}', weatherData.weather[1].totalSnow_cm)
    .replaceAll('{{TOMORROW_UVINDEX}}', weatherData.weather[1].uvIndex)
    .replaceAll('{{TOMORROW_MOON_ILLUMINATION}}', weatherData.weather[1].astronomy[0].moon_illumination)
    .replaceAll('{{TOMORROW_MOON_PHASE}}', weatherData.weather[1].astronomy[0].moon_phase)
    .replaceAll('{{TOMORROW_MOONRISE}}', weatherData.weather[1].astronomy[0].moonrise)
    .replaceAll('{{TOMORROW_MOONSET}}', weatherData.weather[1].astronomy[0].moonset)
    .replaceAll('{{TOMORROW_SUNRISE}}', weatherData.weather[1].astronomy[0].sunrise)
    .replaceAll('{{TOMORROW_SUNSET}}', weatherData.weather[1].astronomy[0].sunset)
    .replaceAll('{{DAY_THREE_AVERAGETEMP}}', weatherData.weather[2]['avgtemp' + degree])
    .replaceAll('{{DAY_THREE_DATE}}', weatherData.weather[2].date)
    .replaceAll('{{DAY_THREE_MAXTEMP}}', weatherData.weather[2]['maxtemp' + degree])
    .replaceAll('{{DAY_THREE_MINTEMP}}', weatherData.weather[2]['mintemp' + degree])
    .replaceAll('{{DAY_THREE_SUNHOUR}}', weatherData.weather[2].sunHour + "hours")
    .replaceAll('{{DAY_THREE_TOTALSNOW_CM}}', weatherData.weather[2].totalSnow_cm)
    .replaceAll('{{DAY_THREE_UVINDEX}}', weatherData.weather[2].uvIndex)
    .replaceAll('{{DAY_THREE_MOON_ILLUMINATION}}', weatherData.weather[2].astronomy[0].moon_illumination)
    .replaceAll('{{DAY_THREE_MOON_PHASE}}', weatherData.weather[2].astronomy[0].moon_phase)
    .replaceAll('{{DAY_THREE_MOONRISE}}', weatherData.weather[2].astronomy[0].moonrise)
    .replaceAll('{{DAY_THREE_MOONSET}}', weatherData.weather[2].astronomy[0].moonset)
    .replaceAll('{{DAY_THREE_SUNRISE}}', weatherData.weather[2].astronomy[0].sunrise)
    .replaceAll('{{DAY_THREE_SUNSET}}', weatherData.weather[2].astronomy[0].sunset)

  //  console.log(script)

    return script
}

module.exports = {
    weathertemplatereplacement
};
