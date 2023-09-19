const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const os = require('os');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { WORKDIR } = require("../constants/path.constants");


const loadApimediaRoutes = (app) => {


  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Media api Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });

// Define an API endpoint to retrieve a media file
app.get('/media/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(WORKDIR, filename);
  logger.info(`Media api filepath: ${filePath}`)

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  // Set the appropriate Content-Type header based on the file extension
  const fileExtension = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream'; // Default content type

  if (fileExtension === '.mp4') {
    contentType = 'video/mp4';
  } else if (fileExtension === '.png') {
    contentType = 'image/png';
  }

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
    loadApimediaRoutes
}
