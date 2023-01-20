const { listFilesindir } = require("../../utils/file.utils")
const { randomNumber } = require("../../utils/randomnumber.utils")

const selectRandomAudioFile = async (path) => {
  //gra the array of files
  const fileList = await listFilesindir(`${retrieveCurrentConfiguration().customaudio}`)
  //generate a random number from array 0 to length
  const randomIndex = randomNumber(fileList.length);

  // Return the chosen random file path
  return fileList[randomIndex].path
}

module.exports = {
    selectRandomAudioFile
}
