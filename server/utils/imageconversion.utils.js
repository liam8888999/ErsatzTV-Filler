const {CONFIG_CONSTANTS, CHANNEL_OFFLINEDIR} = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const { createDirectoryIfNotExists } = require("../utils/file.utils");

async function imageconvert(input) {

  createDirectoryIfNotExists(path.join(CHANNEL_OFFLINEDIR, 'sharpimgdir'))

// Input file path
const inputImagePath = `${input}`; // Replace with your input image path

// Extract the file name (excluding extension) from the inputImagePath
const inputFileName = path.basename(inputImagePath, path.extname(inputImagePath));

// Construct the output file path with the same name and a different extension
const outputImagePath = `${path.join(CHANNEL_OFFLINEDIR, 'sharpimgdir', inputFileName)}.png`;

// Define the conversion options
const conversionOptions = {
  quality: 90, // JPEG quality (0-100)
};

// Perform the image conversion
await sharp(inputImagePath)
  .resize(200, 500, {
    kernel: sharp.kernel.nearest,
    fit: 'inside'
  })
  .toFormat('png', conversionOptions)
  .toFile(outputImagePath, (err, info) => {
    if (err) {
      console.error('Error converting image:', err);
    } else {
      console.log('Image converted successfully:', info);
    }
  });
}

module.exports = {
    imageconvert
}
