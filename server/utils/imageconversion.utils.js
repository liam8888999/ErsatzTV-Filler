const {CONFIG_CONSTANTS, CHANNEL_OFFLINEDIR} = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const fs = require("fs")
const path = require("path")
const Jimp = require("jimp")
const { createDirectoryIfNotExists } = require("../utils/file.utils");

async function imageconvert(input) {

  createDirectoryIfNotExists(path.join(CHANNEL_OFFLINEDIR, 'jimpimgdir'))

// Input file path
const inputImagePath = `${input}`; // Replace with your input image path

// Extract the file name (excluding extension) from the inputImagePath
const inputFileName = path.basename(inputImagePath, path.extname(inputImagePath));

// Construct the output file path with the same name and a different extension
const outputImagePath = `${path.join(CHANNEL_OFFLINEDIR, 'jimpimgdir', inputFileName)}.png`;
logger.info(`Input image path: ${inputImagePath}`)
logger.info(`Output image path: ${outputImagePath}`)


// Perform the image conversion


function processLocalImage() {
  return Jimp.read(inputImagePath)
    .then((image) => {
      return image.contain(200, 200).writeAsync(outputImagePath);
    })
    .then(() => {
      logger.success(`Local image converted to PNG: ${outputImagePath}`);
    })
    .catch((err) => {
      logger.error(`Local image Jimp Error: ${err}`);
      // If there's an error with the local image, fall back to processing the URL-based image
      processUrlImage();
    });
}

// Function to process the URL-based image
function processUrlImage() {
  Jimp.read('https://liam8888999.github.io/ErsatzTV-Filler/images/ersatztv-filler.png')
    .then((image) => {
      return image.contain(200, 200).writeAsync(outputImagePath);
    })
    .then(() => {
      logger.success(`URL-based image converted to PNG: ${outputImagePath}`);
    })
    .catch((err) => {
      logger.error(`URL-based image Jimp Error: ${err}`);
    });
}

await processLocalImage()





}



module.exports = {
    imageconvert
}
