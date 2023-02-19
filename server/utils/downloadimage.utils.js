const https = require('https');
const fs = require('fs');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch image with status code ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          resolve(filepath);
        });
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to download image: ${error.message}`));
    });
  });
}

module.exports = { downloadImage };
