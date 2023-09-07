const { listFilesInDir } = require("../../utils/file.utils");
const { randomNumber } = require("../../utils/randomnumber.utils");
const logger = require("../../utils/logger.utils");
const moment = require('moment-timezone');
const FALLBACKAUDIO = require("../../constants/path.constants")


const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus', 'amr', 'webm', 'amr', 'ape', 'mid', 'midi', 'ac3', 'aiff', 'aif', 'au', 'raw', 'mp2', 'ra', 'rm', 'dsf', 'dts', 'caf', 'alac', 'dff', 'oga', 'ogs', 'spx'];

const selectRandomAudioFile = async (path) => {
  // Get the list of files in the specified directory
  let fileList = await listFilesInDir(path)

  logger.info(fileList);

  // Filter out non-audio files
  fileList = fileList.filter((file) => {
    const extension = file.split('.').pop();
    return audioExtensions.includes(extension.toLowerCase());
  });

  // Check if the directory is empty after filtering for audio files
  if (fileList.length === 0) {
    logger.info("File list is empty");
    // If the directory is empty, retrieve the list of files from the backup directory
    fileList = await listFilesInDir(FALLBACKAUDIO)

    // Filter out non-audio files from the backup directory
    fileList = fileList.filter((file) => {
      const extension = file.split('.').pop();
      return audioExtensions.includes(extension.toLowerCase());
    });
  }

  logger.info(fileList);

  // Generate a random number from 0 to length-1
  const randomIndex = randomNumber(fileList.length);

  const chosenFile = fileList[randomIndex];

  logger.info(chosenFile)

  // Return the chosen random file path
  return chosenFile;

};

module.exports = {
  selectRandomAudioFile
};
