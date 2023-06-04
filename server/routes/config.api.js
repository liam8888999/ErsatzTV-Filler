const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile } = require("../utils/config.utils.js");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { readFile } = require('fs');
const { downloadImage } = require("../utils/downloadimage.utils");

const loadApiConfigRoutes = (app) => {
    /**
     * Patch route to receive updates to the configuration file.
     */
    app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, async (req, res) => {
    const values = Object.entries(req.body);
    logger.info(Object.entries(req.body))

    const arr = values;
const obj = {};

arr.forEach(([key, value]) => {
  obj[key] = value;
});

logger.info(obj); // Output: { key: 'theme', value: 'button1fff' }

const { key, value } = obj;

logger.info(key);
logger.info(value);



  await writeValueToConfigurationFile(key, value)

        res.send({ status: 'OK', result: "success" })
    });
    // show theme json

    app.get('/api/config/readconfigjson', async (req, res) => {
      const filepath = `config.json`;
      readFile(`${filepath}`, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error reading data file');
            return;
          }
          console.log(JSON.parse(data))
          res.json(JSON.parse(data));
        });
      });


}

module.exports = {
    loadApiConfigRoutes
}
