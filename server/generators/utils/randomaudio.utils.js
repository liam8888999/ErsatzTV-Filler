const { listFilesInDir } = require("../../utils/file.utils")
const { randomNumber } = require("../../utils/randomnumber.utils")
const logger = require("../../utils/logger.utils");
const moment = require('moment-timezone');

const selectRandomAudioFile = async (path) => {
  //gra the array of files
  const fileList = await listFilesInDir(path)
  //logger.info(fileList)
  //generate a random number from array 0 to length

  const randomIndex = randomNumber(fileList.length);
  //logger.info(randomIndex)

const listFile = await fileList[randomIndex]
  // Return the chosen random file path
  //  logger.info(listFile)
  return listFile
}

module.exports = {
    selectRandomAudioFile
}
