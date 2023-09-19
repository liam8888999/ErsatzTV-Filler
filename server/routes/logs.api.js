const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const archiver = require('archiver');
const readline = require('readline');
const {LOGFOLDER} = require("../constants/path.constants");
const path = require('path');

const loadApilogsRoutes = (app) => {

  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Logs api Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });


  // Define a route to stream the logs in real-time
  app.get('/logs/load', (req, res) => {
    try {
      const logFile = getLatestLogFile();

        if (!fs.existsSync(logFile)) {
          res.status(404).send('Log file not found');
          logger.error('Log file not found');

   return;
  }

      const logStream = fs.createReadStream(logFile);

      // Handle error event for logStream
      logStream.on('error', (error) => {
        res.status(500).send('Error reading log file');
        logger.error(`cant create logstream: ${error}`);
      });

      const rl = readline.createInterface({
        input: logStream,
        terminal: false
      });

      // Add "line" event listener
      rl.on('line', (line) => {
        try {
          res.write(`<p>${line}</p>\n`);
        } catch (err) {
          logger.error(`An error occurred while processing a line: ${err}`);
          // Handle the error as needed
        }
      });

      // Add "error" event listener
      rl.on('error', (err) => {
        logger.error(`An error occurred in the readline interface: ${err}`);
        // Handle the error as needed
      });

      // End the response when reading is complete
      rl.on('close', () => {
        res.end();
      });
    } catch (error) {
      res.status(500).send('Error getting log file');
      logger.error(`Error with reading and processing logs: ${error.message}`);
    }
  });

  function getLatestLogFile() {
    try {
      const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;


      const logFile = `${path.join(LOGFOLDER, 'ersatztv-filler')}-${formattedDate}.log`;
      return logFile;
    } catch (error) {
      logger.error('Error getting log file', error.message);
   throw new Error('Error getting log file');
    }
  }


  //end logs page



// Endpoint to handle directory zipping and download
app.get('/logs/zip', (req, res) => {
  const directoryPath = LOGFOLDER; // Replace with the path to the directory you want to zip

  // Create a new zip file
  const zipPath = `${directoryPath}.zip`;
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

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
            logger.info('Zip file deleted successfully.');
          }
        });
      }
    });
  });

  archive.pipe(output);
  archive.directory(directoryPath, false);
  archive.finalize();
});



}


module.exports = {
    loadApilogsRoutes
}
