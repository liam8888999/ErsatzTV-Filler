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

app.post('/uploadoldmodeltheme', uploadoldmodeltheme.single('file'), async (req, res) => {
  const file = req.file;
const config_current = await retrieveCurrentConfiguration();
  // Read the file contents
  fs.readFile('workdir/config.conf', 'utf8', (err, data) => {
    if (err) {
      logger.error('Error reading file:', err);
      res.sendStatus(500);
      return;
    }


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
  const trimmedKey = key.trim().replace(/'/g, '').replace(/"/g, '');
  const trimmedValue = value.trim().replace(/'/g, '').replace(/"/g, '');
//  const trimmedValue2 = value.strip

  // Add the key-value pair to the JSON object
  json[trimmedKey] = trimmedValue;

});

    // Convert the JSON object to a string
  //  const jsonString = JSON.stringify(json, null, 2);
    //jsonString1 = jsonString.replace(/'/g, '').replace(/"/g, '')
      // logger.info(json)

    // Write the JSON string to a file
  //  fs.writeFile('config1.json', jsonString1, 'utf8', err => {
    //  if (err) {
      //  logger.error('Error writing JSON file:', err);
        //res.sendStatus(500);
      //  return;
  //    }
//    })

      logger.info('File converted to JSON successfully');

// To add: migrate config to current format

// Step 3: Update the desired value in the JavaScript object
if (Object.keys(json).length !== 0) {
  config_current.theme = json.theme || config_current.theme;
  config_current.processweather = json.processweather || config_current.processweather;
  config_current.processnews = json.processnews || config_current.processnews;
  config_current.processchanneloffline = json.processchanneloffline || config_current.processchanneloffline;
  config_current.customaudio = json.customaudio || config_current.customaudio;
  config_current.output = json.output || config_current.output;
  config_current.city = json.city || config_current.city;
  config_current.state = json.state || config_current.state;
  config_current.generate_weatherv4 = json.generate_weatherv4 || config_current.generate_weatherv4;
  config_current.weathervideofadeoutduration = json.weathervideofadeoutduration || config_current.weathervideofadeoutduration;
  config_current.weathervideofadeinduration = json.weathervideofadeinduration || config_current.weathervideofadeinduration;
  config_current.weatheraudiofadeoutduration = json.weatheraudiofadeoutduration || config_current.weatheraudiofadeoutduration;
  config_current.weatheraudiofadeinduration = json.weatheraudiofadeinduration || config_current.weatheraudiofadeinduration;
  config_current.newsvideofadeoutduration = json.newsvideofadeoutduration || config_current.newsvideofadeoutduration;
  config_current.newsvideofadeinduration = json.newsvideofadeinduration || config_current.newsvideofadeinduration;
  config_current.newsaudiofadeoutduration = json.newsaudiofadeoutduration || config_current.newsaudiofadeoutduration;
  config_current.newsaudiofadeinduration = json.newsaudiofadeinduration || config_current.newsaudiofadeinduration;
  config_current.videolength = json.videolength || config_current.videolength;
  config_current.newsfeed = json.newsfeed || config_current.newsfeed;
  config_current.newsfeed1 = json.newsfeed1 || config_current.newsfeed1;
  config_current.newsfeed2 = json.newsfeed2 || config_current.newsfeed2;
  config_current.xmltv = json.xmltv || config_current.xmltv;
  config_current.videoresolution = json.videoresolution || config_current.videoresolution;
  config_current.newsduration = json.newsduration || config_current.newsduration;
}


// Step 4: Convert the updated object back to a JSON string
const updatedJsonString = JSON.stringify(config_current, null, 2);
logger.info(updatedJsonString)

// Write the updated JSON string back to the file
fs.writeFile('config.json', updatedJsonString, 'utf8', (err) => {
  if (err) {
    logger.error(err);
    return;
  }

  logger.info('JSON file has been updated.');



      res.json({ message: 'File uploaded and converted to JSON successfully' });
    });
  });
});



}

module.exports = {
    loadApiConfigRoutes
}
