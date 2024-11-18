const fs = require('fs');
const cheerio = require('cheerio');
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const http = require('http');
const https = require('https');
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const { FFMPEGCOMMAND, VANITYCARDDIR } = require("../constants/path.constants");
const { exec } = require("child_process")
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const path = require('path');

let isFunctionRunning = false;
const VANITYCARDS = async () => {
if (isFunctionRunning) {
  logger.warn('Vanity Cards Generator is already running.');
  return;
}

isFunctionRunning = true;

  createDirectoryIfNotExists(VANITYCARDDIR);
  const config_current = await retrieveCurrentConfiguration();
  let output_location;
 if (config_current.fillersubdirs) {
   output_location = `${path.join(config_current.output, `VANITYCARDS`)}`
 } else {
   output_location = config_current.output
 }


  const getVanityCard = async (filenumber) => {

    return new Promise((resolve, reject) => {
      // URL of the Chuck Lorre website
      const url = 'https://chucklorre.com/card-json.php';

      // Download the JSON file
      https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {

            // Parse the JSON data
            const json = JSON.parse(data);

            // Get all the image filenames
            const imageFilenames = Object.values(json).map((entry) => entry.img);

            // Select a random image
            const randomImageFilename = imageFilenames[Math.floor(Math.random() * imageFilenames.length)];

            // Download the random image
            const imageUrl = `https://chucklorre.com/images/cards/${randomImageFilename}`;
            https.get(imageUrl, (imageResponse) => {
              const imagePath = `${path.join(VANITYCARDDIR, 'vanitycard')}-${filenumber}.jpg`;

              // Save the image to disk
              const fileStream = fs.createWriteStream(imagePath);
              imageResponse.pipe(fileStream);

              fileStream.on('finish', () => {
                logger.success(`Image downloaded: ${imagePath}`);
                resolve(); // Resolve the promise when image download is complete
              });

              fileStream.on('error', (error) => {
                reject(error); // Reject the promise if there's an error downloading the image
              });
            });
          } catch (error) {
            logger.error(error);
            reject(error); // Reject the promise if there's an error parsing the JSON
          }
        });
      }).on('error', (error) => {
        logger.error(error);
        reject(error); // Reject the promise if there's an error downloading the JSON
      });
    });
  };
const createVanityCard = async (filenumber) => {
  try {
    if (config_current.hwaccel == "") {
      hwaccel = ` `;
      logger.debug('Hwaccell: no hwaccel'); // Use the constant as needed
    } else {
      hwaccel = ` -hwaccel ${config_current.hwaccel} `;
      logger.debug(`Hwaccell: ${hwaccel}`);
    }

    if (config_current.hwaccel_device == "") {
      hwacceldevice = ``;
      logger.debug('Hwaccell_device: no hwacceldevice'); // Use the constant as needed
    } else {
      hwacceldevice = `-hwaccel_device ${config_current.hwaccel_device} `;
      logger.debug(`HWaccell_device: ${hwacceldevice}`);
    }
    const audioFile = await selectRandomAudioFile(config_current.customaudio);
    // add theme information
    // part1
    const commandvanitycard = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=white:${config_current.videoresolution} -i "${path.join(VANITYCARDDIR, 'vanitycard')}-${filenumber}.jpg" -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -c:a copy -t ${config_current.vanitycardduration} "${path.join(output_location, 'vanitycard')}-${filenumber}.mp4"`;
    logger.ffmpeg(`commandvanitycard is ${commandvanitycard}`);

    exec(commandvanitycard, (error, stdout, stderr) => {
      if (error) {
        logger.error(error);
        logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
        // Run another FFmpeg command here on error
  const commandOnError3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=black:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=text='Unfortunately the vanity card filler is unavailable at this time, Hopefully it will be back soon':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.vanitycardduration} "${path.join(output_location, 'vanitycard')}-${filenumber}.mp4"`;
  logger.ffmpeg(`Running vanity card fallback command on error: ${commandOnError3}`);
  exec(commandOnError3, (error3, stdout3, stderr3) => {
    if (error3) {
      logger.error(error3);
      // Handle the error for the second command as needed.
    } else {
      logger.success('vanity card fallback FFmpeg command executed successfully.');
    }
  });

        return;
      }
      if (stderr) {
        logger.ffmpeg(`stderr: ${stderr}`);
      }
      logger.success('Vanity Card created successfully.');
    });
  } catch (err) {
    logger.error(err);
  }
};



async function processVanityCards() {
  logger.info(`Amount of vanity cards: ${config_current.amountvanitycards}`)
  const maxIterations = config_current.amountvanitycards || 5;
  for (let filenumber = 1; filenumber <= maxIterations; filenumber++) {
    await getVanityCard(filenumber);
    await createVanityCard(filenumber);
  }
}

// Assuming you're in an async function or using the `async` keyword somewhere
  try {
await createDirectoryIfNotExists(output_location);
await processVanityCards();
} catch (error) {
  logger.error(error);
    isFunctionRunning = false;
    throw error
}
 isFunctionRunning = false;


};

module.exports = {
  VANITYCARDS
};
