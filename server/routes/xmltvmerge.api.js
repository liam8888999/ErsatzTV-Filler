const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { WEATHER } = require("../generators/weather.generator");
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const archiver = require('archiver');
const readline = require('readline');
const path = require('path');
const { XMLTVMERGEDIR } = require("../constants/path.constants");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");

const loadApixmltvmergeRoutes = (app) => {
  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Page routes Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    if (req.accepts('html')) {
    // Render an error HTML page
    res.status(status).send(`<html><head><style>body { background-color: #4d4d4d; }</style><title>Error</title></head><body><center><br><br><br><h1 style="color: red;">Error: ${status}</h1></center><br><center><h2 style="color: orange;">OOPS, Something went terribly wrong.</h2><br><span style="font-size: 48px;">🙁</span></center></body></html>`);

  } else {
    // Send a JSON response to the client
    res.status(status).json({ error: message });
  }
  });


  // Define an API endpoint to retrieve a media file
  app.get('/xmltvmerge/:filename', async (req, res) => {
  const config_current = await retrieveCurrentConfiguration();
  const { filename } = req.params;
  const filePath = path.join(config_current.output, filename);
  logger.info(`XMLTVMERGE api retrieval filename: ${filePath}`)

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  // Set the appropriate Content-Type header based on the file extension
  const fileExtension = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream'; // Default content type

  //if (fileExtension === '.xml') {
  //  contentType = 'video/mp4';
  //} else if (fileExtension === '.png') {
    //contentType = 'image/png';
//  }

  // Read the file and send it as a response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    res.set('Content-Type', contentType);
    res.send(data);
  });
  });
  }


module.exports = {
    loadApixmltvmergeRoutes
}
