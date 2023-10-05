const https = require('https');
const http = require('http');
const fs = require('fs');
const logger = require("../utils/logger.utils");


function downloadImage(url, filepath) {
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          reject(new Error('Redirect location not found'));
          return;
        }
        downloadImage(redirectUrl, filepath)  // Follow the redirect recursively
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download with status code ${response.statusCode}`));
        // see how it goes with logger
        logger.error(`Failed to download with status code ${response.statusCode}`);
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          resolve(filepath);
        });
      });
    });

    request.on('error', (error) => {
      reject(new Error(`Failed to download: ${error.message}`));
      logger.error(`Failed to download: ${error.message}`);
    });
  });
}


module.exports = { downloadImage };
