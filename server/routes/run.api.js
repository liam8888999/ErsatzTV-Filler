const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");

const loadApirunRoutes = (app) => {

// run weather function
app.get('/api/run/weather', async () => {
console.log("running weather function")
await WEATHER();
// use the url and path variables to set the theme

});

  // run news function

  app.get('/api/run/news', async () => {
  logger.info("running news function")
  await News();
  // use the url and path variables to set the theme

});

// run channel-offline function
app.get('/api/run/channel-offline', async () => {
logger.info("running channel-offline function")
//await ChannelOffline();
// use the url and path variables to set the theme

});

}

module.exports = {
    loadApirunRoutes
}
