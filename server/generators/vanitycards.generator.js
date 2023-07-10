const fs = require('fs');
const cheerio = require('cheerio');
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const http = require('http');
const https = require('https');
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const { FFMPEGCOMMAND } = require("../constants/path.constants");
const { exec } = require("child_process")

// Future todo. add option to add episode number/episode title to main description for clients without support

const VANITYCARDS = async () => {

  const config_current = await retrieveCurrentConfiguration();
  const audioFile = await selectRandomAudioFile(config_current.customaudio);


  const getVanityCard = async (filenumber) => {
    return new Promise((resolve, reject) => {
      // URL of the Chuck Lorre website
      const url = 'http://chucklorre.com/card-json.php';

      // Download the JSON file
      http.get(url, (response) => {
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
            const imageUrl = `http://chucklorre.com/images/cards/${randomImageFilename}`;
            http.get(imageUrl, (imageResponse) => {
              const imagePath = `workdir/vanitycard/vanitycard-${filenumber}.jpg`;

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
            console.error('Error parsing JSON:', error);
            reject(error); // Reject the promise if there's an error parsing the JSON
          }
        });
      }).on('error', (error) => {
        console.error('Error downloading JSON:', error);
        reject(error); // Reject the promise if there's an error downloading the JSON
      });
    });
  };

const createVanityCard = async (filenumber) => {
  try {
    // add theme information
    // part1
    const commandvanitycard = `${FFMPEGCOMMAND} -f lavfi -i color=white:${config_current.videoresolution} -i workdir/vanitycard/vanitycard-${filenumber}.jpg -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.videolength} ${config_current.output}/vanitycard-${filenumber}.mp4`;
    logger.info(commandvanitycard);
    logger.ffmpeg(`commandvanitycard is ${commandvanitycard}`);

    exec(commandvanitycard, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);
        logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
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
  logger.info(config_current.amountvanitycards)
  const maxIterations = config_current.amountvanitycards || 5;
  for (let filenumber = 1; filenumber <= maxIterations; filenumber++) {
    await getVanityCard(filenumber);
    await createVanityCard(filenumber);
  }
}

// Assuming you're in an async function or using the `async` keyword somewhere
await processVanityCards();

};

module.exports = {
  VANITYCARDS
};
