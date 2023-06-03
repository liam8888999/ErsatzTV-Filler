const https = require('https');
const { version } = require('../../package.json');
const logger = require("../utils/logger.utils");

async function checkForUpdates() {
  try {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/liam8888999/ErsatzTV-Filler/releases/latest',
      headers: {
        'User-Agent': 'Node.js' // GitHub API requires a User-Agent header
      }
    };

    // Make the HTTP request to the GitHub API
    const response = await new Promise((resolve, reject) => {
      const req = https.get(options, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
        const data = [];
        res.on('data', (chunk) => {
          data.push(chunk);
        });
        res.on('end', () => {
          resolve(JSON.parse(Buffer.concat(data).toString()));
        });
      });
      req.on('error', (error) => {
        reject(error);
      });
    });

    const latestVersion = response.tag_name//.replace(/^V/, '');

    // Check if the latest version is different from the installed version
    const currentVersion = `${version}`; // Implement this function to get the current version
    console.log(currentVersion)
    console.log(latestVersion)
    if (currentVersion === latestVersion) {
        logger.updates('Application is already up to date.')
      return 'Application is already up to date.';
    } else {
        logger.updates(`Newer version is available: ${latestVersion}`)
      return `Newer version is available: ${latestVersion}`;
    }
  } catch (error) {
    logger.updates(`Error checking for updates: ${error.message}`)
    return `Error checking for updates: ${error.message}`;
  }
}

module.exports = { checkForUpdates };
