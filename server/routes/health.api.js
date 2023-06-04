const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const os = require('os');


const loadApihealthRoutes = (app) => {

// run weather function
app.get('/api/health', async (req, res) => {
  const osInfo = {
    platform: os.platform(),
    hostname: os.hostname(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus(),
    loadAverage: os.loadavg()
   };

   res.json({ status: 'OK', os: osInfo });
   console.log(osInfo)
 });
}

module.exports = {
    loadApihealthRoutes
}
