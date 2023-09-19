const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const { NEWS } = require("../generators/news.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { VANITYCARDS } = require("../generators/vanitycards.generator");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");

const loadApirunRoutes = (app) => {


  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error('Run api Error:', err); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });

// run weather function
app.get('/api/run/weather', async () => {
logger.info("running weather function from run api")
await WEATHER();
// use the url and path variables to set the theme

});

  // run news function

  app.get('/api/run/news', async () => {
  logger.info("running news function from run api")
  await NEWS();
  // use the url and path variables to set the theme

});

// run channel-offline function
app.get('/api/run/channel-offline', async () => {
logger.info("running channel-offline function from run api")
await CHANNEL_OFFLINE();
// use the url and path variables to set the theme

});

// run xmltvmerger function
app.get('/api/run/xmltvmerger', async () => {
logger.info("running xmltvmerger function from run api")
const config_current = await retrieveCurrentConfiguration()
if (!(typeof config_current.epgfiles === 'undefined' || config_current.epgfiles === '' || config_current.epgfiles === 'null')) {
await XMLTVPARSE();
} else {
  logger.info('no epg files set so merger not running from run api')
}// use the url and path variables to set the theme

});

// run vanity card function
app.get('/api/run/vanitycard', async () => {
logger.info("running Vanity Cards function from run api")
await VANITYCARDS();
// use the url and path variables to set the theme

});

}

module.exports = {
    loadApirunRoutes
}
