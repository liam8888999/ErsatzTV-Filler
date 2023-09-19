const { listFilesInDir } = require("../../utils/file.utils");
const { randomNumber } = require("../../utils/randomnumber.utils");
const logger = require("../../utils/logger.utils");
const { AUDIOFALLBACK } = require("../../constants/path.constants")



const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus', 'amr', 'webm', 'amr', 'ape', 'mid', 'midi', 'ac3', 'aiff', 'aif', 'au', 'raw', 'mp2', 'ra', 'rm', 'dsf', 'dts', 'caf', 'alac', 'dff', 'oga', 'ogs', 'spx'];

const selectRandomAudioFile = async (path) => {
  let selectedPath = path;
logger.info('Selected Path:', selectedPath)
  if (!selectedPath) {
    // Handle the case where 'path' is undefined or falsy
    logger.info("Custom Audio Path parameter is undefined or empty. Using the audio-fallback directory.");
    selectedPath = `${AUDIOFALLBACK}`; // Set the backup directory
  }
logger.info('Selected Path:', selectedPath)
  // Get the list of files in the specified directory or backup directory
  let fileList = await listFilesInDir(selectedPath);

  logger.info('Audio Files List:', fileList);

  // Filter out non-audio files
  fileList = fileList.filter((file) => {
    const extension = file.split('.').pop();
    return audioExtensions.includes(extension.toLowerCase());
  });

  // Check if the directory is empty after filtering for audio files
  if (fileList.length === 0) {
    logger.info("Audio File list is empty, Using the audio-fallback directory");
    // If the directory is empty, retrieve the list of files from the backup directory
    fileList = await listFilesInDir(`${AUDIOFALLBACK}`);

    // Filter out non-audio files from the backup directory
    fileList = fileList.filter((file) => {
      const extension = file.split('.').pop();
      return audioExtensions.includes(extension.toLowerCase());
    });
  }

  logger.info('Audio filelist:', fileList);

  // Generate a random number from 0 to length-1
  const randomIndex = randomNumber(fileList.length);

  const chosenFile = fileList[randomIndex];

  logger.info('Selected Audio File:', chosenFile);

  // Return the chosen random file path
  return chosenFile;
};



module.exports = {
  selectRandomAudioFile
};
