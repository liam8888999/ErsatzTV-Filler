const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const os = require('os');
const { exec } = require('child_process');


const loadApihealthRoutes = (app) => {

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
    console.log(message.status);
    return message.status;
  })
  .catch(error => console.error(error));

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
console.log(osInfo);
});

}

module.exports = {
    loadApihealthRoutes
}
