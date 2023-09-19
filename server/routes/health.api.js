const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const {FFMPEGCOMMAND} = require("../constants/path.constants");
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
    logger.error('Health api Error:', err); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });

// run weather function
app.get('/api/health', async (req, res) => {


  function checkFFmpegInstallation() {
  const requiredVersion = '6.0'; // Specify the required FFmpeg version here

  return new Promise((resolve, reject) => {
    exec(`${FFMPEGCOMMAND} -version`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error('FFmpeg is not installed. Please install it to create filler video files.'));
        return;
      }

      const versionMatch = stdout.match(/version\s(\d+\.\d+)/);
      if (versionMatch && versionMatch[1] >= requiredVersion) {
        if (stdout.includes('libass')) {
          resolve({ status: 'FFmpeg is installed. Everything will work.' });
        } else {
          resolve({ status: 'FFmpeg is installed. libass is not compiled in. The News generator will not work.' });
        }
          } else {
        resolve({ status: `FFmpeg is installed, but the required version ${requiredVersion} or higher is not available. Some functions may not work` });
      }
    });
  });
}

  checkFFmpegInstallation()
    .then(message => {
      logger.info('Check ffmpeg installation:', message.status);
      return message.status;
    })
    .catch(error => logger.error('Error checking ffmpeg installation:', error));

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
logger.info('System info from health api:', osInfo);
});


}


module.exports = {
    loadApihealthRoutes
}
