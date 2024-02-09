const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const {writeValueToConfigurationFile} = require("../utils/config.utils.js");
const logger = require("../utils/logger.utils");
const archiver = require('archiver');
const {downloadImage} = require("../utils/downloadimage.utils");
const {setWebTheme} = require("../utils/config.utils.js");
const multer = require('multer');
const fs = require('fs');
const axios = require('axios').default;
const {
  CONFIG_CONSTANTS,
  CONFIGCONFDIR,
  CONFIG_DIR,
  WORKDIR,
  THEMES_FOLDER,
  startUpPath, WEATHERDIR
} = require("../constants/path.constants");
const path = require('path');
const extract = require('extract-zip');
const {retrieveCurrentConfiguration} = require("../modules/config-loader.module");
const {
  weatherTemplateData,
  weatherTemplateReplacement,
  currentTemplate
} = require("../generators/utils/weather-templating.utils");
const {doesFileExist, createDirectoryIfNotExists} = require("../utils/file.utils");

const loadApiConfigRoutes = async (app) => {
  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Page routes Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    if (req.accepts('html')) {
      // Render an error HTML page
      res.status(status).send(`<html lang="en"><head><style>body { background-color: #4d4d4d; }</style><title>Error</title></head><body><center><br><br><br><h1 style="color: red;">Error: ${status}</h1></center><br><center><h2 style="color: orange;">OOPS, Something went terribly wrong.</h2><br><span style="font-size: 48px;">🙁</span></center></body></html>`);

    } else {
      // Send a JSON response to the client
      res.status(status).json({error: message});
    }
  });

  /**
   * Patch route to receive updates to the configuration file.
   */
  app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, async (req, res) => {
    const values = Object.entries(req.body);
    logger.info(`Config object.entries: ${Object.entries(req.body)}`)

    const arr = values;
    const obj = {};

    arr.forEach(([key, value]) => {
      obj[key] = value;
    });

    logger.info(`config obj: ${obj}`); // Output: { key: 'theme', value: 'button1fff' }

    const {key, value} = obj;

    logger.info(`Config Key: ${key}`);
    logger.info(`Config Value: ${value}`);


    await writeValueToConfigurationFile(key, value)

    res.send({status: 'OK', result: "success"})
  });

  app.get('/api/config/readconfigjson', async (req, res) => {
    const filepath = CONFIG_CONSTANTS().USER_CONFIG;
    fs.readFile(`${filepath}`, 'utf8', (err, data) => {
      if (err) {
        logger.error(`Error reading config json: ${err}`);
        res.status(500).send('Error reading data file');
        return;
      }
      logger.success(`Config json parsed: ${JSON.parse(data)}`)
      res.json(JSON.parse(data));
    });
  });

  //Support for a link on the config to view the data used to merge the template
  app.get('/api/config/weatherdata', async (req, res) => {
    const config_current = await retrieveCurrentConfiguration();
    const weatherData = await axios.get(`https://wttr.in/${config_current.city}?format=j2`);
    if (weatherData.status === 200) {
      res.json(weatherTemplateData(weatherData.data, config_current));
    } else {
      res.status(500).send('Error getting weather data');
    }
  });

  //Support for a link on the config to view the template and the merged result
  app.get('/api/config/weatherscriptpreview', async (req, res) => {
    try {
      const config_current = await retrieveCurrentConfiguration();
      if (!await doesFileExist(`${path.join(WEATHERDIR, 'weather2.json')}`)) {
        createDirectoryIfNotExists(WEATHERDIR);
        await downloadImage(`https://wttr.in/${config_current.city}?format=j2`, `${path.join(WEATHERDIR, 'weather2.json')}`);
      }
      const template = await currentTemplate();
      const merged = await weatherTemplateReplacement(template);
      res.json({
        scripts: [{
          script: template,
          processed: merged
        }]
      });
    } catch (e) {
      logger.error(e);
      res.status(500).send('Error getting weather data');
    }
  });

// show theme json
  app.get('/api/config/webtheme/set', async (req) => {
    const theme = req.query.theme;
    logger.info(`Theme to set in config: ${theme}`)
    logger.info(`Theme to set in config from req.query.theme: ${req.query.theme}`)
    await setWebTheme(theme)
    // use the url and path variables to set the theme

  });


  app.get('/api/config/webtheme/load', async (req, res) => {
    const config_current = await retrieveCurrentConfiguration();
    try {
      const theme = config_current.webtheme;
      // Replace the code below with your logic to fetch the theme preference from a data source (e.g., a database)
      //const theme = 'dark'; // Replace with your desired theme value
      logger.info(`Theme to load from config: ${theme}`)
      res.json({theme});
    } catch (error) {
      logger.error(`Failed to load the theme preference: ${error}`);
      res.status(500).json({error: 'Failed to load the theme preference'});
    }
  });

  const storage = multer.diskStorage({
    destination: CONFIGCONFDIR,
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Preserve the original file name
    }
  });

  const uploadoldmodeltheme = multer({storage});

  app.post('/uploadoldmodeltheme', uploadoldmodeltheme.single('file'), async (req, res) => {
    const config_current = await retrieveCurrentConfiguration();
    // Read the file contents
    fs.readFile(`${path.join(CONFIGCONFDIR, 'config.conf')}`, 'utf8', (err, data) => {
      if (err) {
        logger.error(`Error reading old type config.conf file from upload: ${err}`);
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

        // Add the key-value pair to the JSON object
        json[trimmedKey] = value.trim().replace(/'/g, '').replace(/"/g, '');

      });

      // Convert the JSON object to a string
      //  const jsonString = JSON.stringify(json, null, 2);
      //jsonString1 = jsonString.replace(/'/g, '').replace(/"/g, '')
      // logger.debug(json)

      // Write the JSON string to a file
      //  fs.writeFile('config1.json', jsonString1, 'utf8', err => {
      //  if (err) {
      //  logger.error(`Error writing JSON file: ${err}`);
      //res.sendStatus(500);
      //  return;
      //    }
//    })

      logger.success('File converted to JSON successfully');


      if (json.xmltv) {
        json.xmltv = json.xmltv.replace('/iptv/xmltv.xml', '');
      }

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
        config_current.weatherduration = json.videolength || config_current.videolength;
        config_current.vanitycardduration = json.videolength || config_current.videolength;
        config_current.newsfeed = json.newsfeed || config_current.newsfeed;
        config_current.newsfeed1 = json.newsfeed1 || config_current.newsfeed1;
        config_current.newsfeed2 = json.newsfeed2 || config_current.newsfeed2;
        config_current.ersatztv = json.xmltv || config_current.ersatzTV;
        config_current.videoresolution = json.videoresolution || config_current.videoresolution;
        config_current.newsduration = json.newsduration || config_current.newsduration;
      }


// Step 4: Convert the updated object back to a JSON string
      const updatedJsonString = JSON.stringify(config_current, null, 2);
      logger.success(`Updated config after old type import: ${updatedJsonString}`)

// Write the updated JSON string back to the file
      fs.writeFile(`${CONFIG_CONSTANTS().USER_CONFIG}`, updatedJsonString, 'utf8', (err) => {
        if (err) {
          logger.error('Error writing updated json from old type config to file:', err);
          return;
        }

        logger.success('JSON file has been updated.');


        res.json({message: 'File uploaded and converted to JSON successfully'});
      });
    });
  });


// Endpoint to handle directory zipping and download
  app.get('/api/config/backup', (req, res) => {
    const directoryPath1 = CONFIG_DIR; // Replace with the path to the first directory you want to zip
    const directoryPath2 = THEMES_FOLDER; // Replace with the path to the second directory you want to zip
    const currentDate = new Date();
    // Create a new zip file
    const zipPath = `ersatztv-filler-backup-${currentDate}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {zlib: {level: 9}});

    output.on('close', () => {
      // Download the zip file
      res.download(zipPath, (err) => {
        if (err) {
          logger.error(`Error occurred while downloading: ${err}`);
        } else {
          // Delete the zip file
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) {
              logger.error(`Error occurred while deleting the zip file: ${unlinkErr}`);
            } else {
              logger.success('Zip file deleted successfully.');
            }
          });
        }
      });
    });

    archive.pipe(output);
    archive.directory(directoryPath1, "config"); // Add the first directory to the zip
    archive.directory(directoryPath2, "themes"); // Add the second directory to the zip
    archive.finalize();
  });


  const restoreStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, WORKDIR); // Set the destination folder where the zip will be extracted.
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Preserve the original file name
    }
  });

  const restoreconfigs = multer({storage: restoreStorage});

  app.post('/api/config/restore', restoreconfigs.single('file'), async (req, res) => {
    try {
      const file = req.file;

      // Check if the uploaded file is a zip file
      if (file.mimetype !== 'application/zip') {
        return res.status(400).json({error: 'Invalid file format. Please upload a ZIP file.'});
      }
      // Extract the uploaded zip file to the destination directory
      await extract(file.path, {dir: startUpPath}, (err) => {
        if (err) {
          logger.error(`error: 'Failed to extract the zip file.' `)
          return res.status(500).json({error: 'Failed to extract the zip file.'});
        }
      });
      // Delete the uploaded zip file after extraction
      fs.unlink(file.path, (err) => {
        if (err) {
          logger.error('Error deleting zip file:', err);
          return res.status(500).json({error: 'Failed to delete the zip file after extraction.'});
        }
        logger.success(`restore successfully completed`)
        res.json({message: 'Restoration completed successfully'});
      });
    } catch (error) {
      res.status(500).json({error: 'Internal server error.'});
    }
  });


}

module.exports = {
  loadApiConfigRoutes
}
