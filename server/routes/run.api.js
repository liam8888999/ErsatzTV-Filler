const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../server/generators/weather.generator");

const loadApiThemeRoutes = (app) => {

// run weather function
app.get('/api/run/weather', async () => {
logger.info("running weather function")
await WEATHER();
// use the url and path variables to set the theme

});

  // run news function

  app.get('/api/run/news', async () => {
  logger.info("running news function")
  await settheme();
  // use the url and path variables to set the theme

});

// run channel-offline function
app.get('/api/run/channel-offline', async () => {
logger.info("running channel-offline function")
await settheme();
// use the url and path variables to set the theme

});

}

module.exports = {
    runApiThemeRoutes
}
