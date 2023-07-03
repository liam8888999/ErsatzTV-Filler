const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile } = require("../utils/config.utils.js");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { readFile } = require('fs');
const { downloadImage } = require("../utils/downloadimage.utils");
const { setwebtheme } = require("../utils/config.utils.js");
const multer = require('multer');
const fs = require('fs');

const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");

const loadApiConfigRoutes = async (app) => {


  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(err); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });


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
            logger.error(err);
            res.status(500).send('Error reading data file');
            return;
          }
          logger.info(JSON.parse(data))
          res.json(JSON.parse(data));
        });
      });

      app.get('/api/config/webtheme/set', async (req, res) => {
        const theme = req.query.theme;
        logger.info(theme)
        logger.info(req.query.theme)
        await setwebtheme(theme)
        // use the url and path variables to set the theme

      });


      app.get('/api/config/webtheme/load', async (req, res) => {
        const config_current = await retrieveCurrentConfiguration();
    try {
const theme = config_current.webtheme;
      // Replace the code below with your logic to fetch the theme preference from a data source (e.g., a database)
      //const theme = 'dark'; // Replace with your desired theme value
logger.info(theme)
      res.json({ theme });
    } catch (error) {
      logger.error('Failed to load the theme preference:', error);
      res.status(500).json({ error: 'Failed to load the theme preference' });
    }
  });




  const storage = multer.diskStorage({
    destination: 'workdir/',
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Preserve the original file name
    }
  });

  const uploadoldmodeltheme = multer({ storage });

app.post('/uploadoldmodeltheme', uploadoldmodeltheme.single('file'), (req, res) => {
  const file = req.file;

  // Read the file contents
  fs.readFile('workdir/config.conf', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.sendStatus(500);
      return;
    }
console.log(data)

const lines = data.split('\n');

const json = {};
lines.forEach(line => {
  // Ignore empty lines and comments
  if (line.trim() === '' || line.trim().startsWith('#')) {
    return;
  }

  // Split the line into key and value
  const [key, ...values] = line.split('=');

  // Join the remaining values in case the value itself contains the '=' character
  const value = values.join('=');

  // Trim whitespace and remove quotes from the value
  const trimmedKey = key.trim();
  const trimmedValue = value.trim().replace(/'/g, '');

  // Add the key-value pair to the JSON object
  json[trimmedKey] = trimmedValue;
});

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(json, null, 2);

    // Write the JSON string to a file
    fs.writeFile('converted_file.json', jsonString, 'utf8', err => {
      if (err) {
        console.error('Error writing JSON file:', err);
        res.sendStatus(500);
        return;
      }

      console.log('File converted to JSON successfully');
      res.json({ message: 'File uploaded and converted to JSON successfully' });
    });
  });
});



}

module.exports = {
    loadApiConfigRoutes
}
