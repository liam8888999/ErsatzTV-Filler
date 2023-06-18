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


const loadApihealthRoutes = (app) => {


  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(err); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });

// run weather function
app.get('/api/health', async (req, res) => {

  function checkFFmpegInstallation() {
    return new Promise((resolve, reject) => {
      exec('ffmpeg -version', (error, stdout, stderr) => {
        if (error) {
          reject(new Error('FFmpeg is not installed. Please install in order to create filler video files.'));
          return;
        }

        resolve({ status: 'FFmpeg is installed.' });
      });
    });
  }

  checkFFmpegInstallation()
  .then(message => {
    logger.info(message.status);
    return message.status;
  })
  .catch(error => logger.error(error));

const osInfo = {
  platform: os.platform(),
  hostname: os.hostname(),
  totalMemory: os.totalmem(),
  freeMemory: os.freemem(),
  cpus: os.cpus(),
  loadAverage: os.loadavg(),
  ffmpeg: await checkFFmpegInstallation().then(message => message.status),
};

res.json({ status: 'OK', os: osInfo });
logger.info(osInfo);
});


}


module.exports = {
    loadApihealthRoutes
}
