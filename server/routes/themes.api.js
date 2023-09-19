const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { readFile } = require('fs');
const {THEMES_FOLDER} = require("../constants/path.constants");
const path = require('path');


const loadApiThemeRoutes = (app) => {

  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Themes api Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });



// download theme api
    app.get('/api/themes/download', (req, res) => {
    const url = req.query.url;
    const filepath = `${path.join(THEMES_FOLDER, 'system', req.query.filepath)}`;
    logger.info(`Theme download req query filepath: ${req.query.filepath}`)

    // use the url and path variables to download the image
    downloadImage(url, filepath)
      .then(() => {
        res.status(200).send('Theme downloaded successfully.');
      })
      .catch((error) => {
        res.status(500).send(`Error downloading Theme: ${error.message}`);
        logger.error(`Error downloading Theme: ${error.message}`)
      });
  });

  // set theme api

  app.get('/api/themes/settheme', async (req, res) => {
  const theme = req.query.theme;
  logger.info(`Theme set req query theme: ${req.query.theme}`)
  await settheme(theme)
  // use the url and path variables to set the theme

});

// show theme json

app.get('/api/themes/readthemejson', async (req, res) => {
  const filepath = `${path.join(THEMES_FOLDER, req.query.filepath)}`;
  readFile(`${filepath}`, 'utf8', (err, data) => {
      if (err) {
        logger.error(`Error reading theme json: ${err}`);
        res.status(500).send('Error reading data file');
        return;
      }
      logger.info(`Theme json: ${JSON.parse(data)}`)
      res.json(JSON.parse(data));
    });
  });


};





module.exports = {
    loadApiThemeRoutes
}
