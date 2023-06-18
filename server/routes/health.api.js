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





// Endpoint to handle directory zipping and download
app.get('/zip', (req, res) => {
  const directoryPath = 'logs'; // Replace with the path to the directory you want to zip

  // Create a new zip file
  const zipPath = `${directoryPath}.zip`;
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    // Download the zip file
    res.download(zipPath, (err) => {
      if (err) {
        console.error('Error occurred while downloading:', err);
      } else {
        // Delete the zip file
        fs.unlink(zipPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error occurred while deleting the zip file:', unlinkErr);
          } else {
            console.log('Zip file deleted successfully.');
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
    loadApihealthRoutes
}
