const { listFilesInDir } = require("../../utils/file.utils");
const { randomNumber } = require("../../utils/randomnumber.utils");
const logger = require("../../utils/logger.utils");
const { AUDIOFALLBACK } = require("../../constants/path.constants");
const chokidar = require('chokidar');

// Set accepted audio extensions
const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus', 'amr', 'webm', 'amr', 'ape', 'mid', 'midi', 'ac3', 'aiff', 'aif', 'au', 'raw', 'mp2', 'ra', 'rm', 'dsf', 'dts', 'caf', 'alac', 'dff', 'oga', 'ogs', 'spx'];

const audioFileCache = new Map();

// Function to update the cache for a directory
const updateCacheForDirectory = async (directoryPath) => {
  const fileList = await listFilesInDir(directoryPath);

  const filteredList = fileList.filter((file) => {
    const extension = file.split('.').pop();
    return audioExtensions.includes(extension.toLowerCase());
  });

  audioFileCache.set(directoryPath, filteredList);
  logger.info(`Updated Audio Files List for ${directoryPath}`);
};

// Watch the selectedPath directory for changes
const watchDirectory = (directoryPath) => {
  const watcher = chokidar.watch(directoryPath, { persistent: true });

  watcher.on('add', async (filePath) => {
    // Handle file additions
    await updateCacheForDirectory(directoryPath);
  });

  watcher.on('unlink', async (filePath) => {
    // Handle file deletions
    await updateCacheForDirectory(directoryPath);
  });

  watcher.on('change', async (filePath) => {
    // Handle file changes
    await updateCacheForDirectory(directoryPath);
  });

  return watcher;
};

// Select Random audio file
const selectRandomAudioFile = async (path) => {
  let selectedPath = path;
  logger.info(`Selected Path: ${selectedPath}`);

  if (!selectedPath) {
    logger.info("Custom Audio Path parameter is undefined or empty. Using the audio-fallback directory.");
    selectedPath = AUDIOFALLBACK;
  }

  if (audioFileCache.has(selectedPath)) {
    // Use cached file list if available
    fileList = audioFileCache.get(selectedPath);
    logger.info(`Using cached Audio Files List for ${selectedPath}`);
  } else {
    // If not cached, retrieve and cache the list
    await updateCacheForDirectory(selectedPath);

    // Start watching for changes in the selected directory
     if (selectedPath !== AUDIOFALLBACK) {
    watchDirectory(selectedPath);
  }
  }

  logger.info(`Audio filelist: ${fileList}`);

  const randomIndex = randomNumber(fileList.length);
  const chosenFile = fileList[randomIndex];

  logger.info(`Selected Audio File: ${chosenFile}`);

  return chosenFile;
};

module.exports = {
  selectRandomAudioFile
};
