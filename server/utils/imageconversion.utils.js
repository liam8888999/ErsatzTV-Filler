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
const outputImagePath = `${path.join(CHANNEL_OFFLINEDIR, 'jimpimgdir', inputFileName)}`;
console.log(inputImagePath)
console.log(outputImagePath)
// Perform the image conversion
await Jimp.read(inputImagePath)
  .then(image => {
    // Resize the image to a specific width and height
    return image
    .contain(200, 200)
    .write(`${outputImagePath}.png`); // Change the dimensions as needed

    // If you want to convert to a different format (e.g., PNG), use:
    // return image.resize(300, 200).write('output.png');
  })
  .catch(err => {
    console.error('image conversion error:', err);
  });

}

module.exports = {
    imageconvert
}
