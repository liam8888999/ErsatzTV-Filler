const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");

const loadApihealthRoutes = (app) => {

// run weather function
app.get('/api/health', async () => {
console.log("running weather function")
await WEATHER();
// use the url and path variables to set the theme

});
}

module.exports = {
    loadApihealthRoutes
}
