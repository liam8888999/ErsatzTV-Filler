const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { readFile } = require('fs');

const loadApiThemeRoutes = (app) => {

// download theme api
    app.get('/api/themes/download', (req, res) => {
    const url = req.query.url;
    const filepath = `themes/system/${req.query.filepath}`;
    logger.info(req.query.filepath)

    // use the url and path variables to download the image
    downloadImage(url, filepath)
      .then(() => {
        res.status(200).send('Image downloaded successfully.');
      })
      .catch((error) => {
        res.status(500).send(`Error downloading image: ${error.message}`);
        logger.error(`Error downloading image: ${error.message}`)
      });
  });

  // set theme api

  app.get('/api/themes/settheme', async (req, res) => {
  const theme = req.query.theme;
  logger.info(req.query.theme)
  await settheme(theme)
  // use the url and path variables to set the theme

});

// show theme json

app.get('/api/themes/readthemejson', async (req, res) => {
  const filepath = `themes/system/${req.query.filepath}`;
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


};





module.exports = {
    loadApiThemeRoutes
}
