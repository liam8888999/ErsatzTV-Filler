const fs = require('fs');
const cheerio = require('cheerio');
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const http = require('http');
const https = require('https');

// Future todo. add option to add episode number/episode title to main description for clients without support

const VANITYCARDS = async () => {
  // URL of the Chuck Lorre website
  // URL of the JSON file
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
console.log(imageFilenames)
      // Select a random image
      const randomImageFilename = imageFilenames[Math.floor(Math.random() * imageFilenames.length)];
console.log(randomImageFilename)
      // Download the random image
      const imageUrl = `http://chucklorre.com/images/cards/${randomImageFilename}`;
      http.get(imageUrl, (imageResponse) => {

        const imagePath = `workdir/vanitycard/vanitycard.jpg`;

        // Save the image to disk
        const fileStream = fs.createWriteStream(imagePath);
        imageResponse.pipe(fileStream);

        fileStream.on('finish', () => {
          console.log(`Image downloaded: ${imagePath}`);
        });
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error downloading JSON:', error);
});



};

module.exports = {
  VANITYCARDS
};
