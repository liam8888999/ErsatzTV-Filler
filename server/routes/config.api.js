const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile } = require("../utils/config.utils.js");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { readFile } = require('fs');
const { downloadImage } = require("../utils/downloadimage.utils");
const { setwebtheme } = require("../utils/config.utils.js");

const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");

const loadApiConfigRoutes = async (app) => {
  let config_current = await retrieveCurrentConfiguration();
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

      app.get('/api/config/webtheme/set', async (req, res) => {
        const theme = req.query.theme;
        console.log(theme)
        logger.info(req.query.theme)
        await setwebtheme(theme)
        // use the url and path variables to set the theme

      });


      app.get('/api/config/webtheme/load', async (req, res) => {
    try {
const theme = config_current.webtheme;
      // Replace the code below with your logic to fetch the theme preference from a data source (e.g., a database)
      //const theme = 'dark'; // Replace with your desired theme value
console.log(theme)
      res.json({ theme });
    } catch (error) {
      console.error('Failed to load the theme preference:', error);
      res.status(500).json({ error: 'Failed to load the theme preference' });
    }
  });


}

module.exports = {
    loadApiConfigRoutes
}
