const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile } = require("../utils/config.utils.js");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');

const { downloadImage } = require("../utils/downloadimage.utils");

const loadApiConfigRoutes = (app) => {
    /**
     * Patch route to receive updates to the configuration file.
     */
    app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, async (req, res) => {
    const values = Object.entries(req.body);
    console.log(Object.entries(req.body))

    const arr = values;
const obj = {};

arr.forEach(([key, value]) => {
  obj[key] = value;
});

console.log(obj); // Output: { key: 'theme', value: 'button1fff' }

const { key, value } = obj;

console.log(key);
console.log(value);



  await writeValueToConfigurationFile(key, value)

        res.send({ result: "success" })
    });

}

module.exports = {
    loadApiConfigRoutes
}
