const { listFilesindir } = require("../../utils/file.utils")
const { randomNumber } = require("../../utils/randomnumber.utils")

function randomaudio(){
const fileList = await listFiles('${retrieveCurrentConfiguration().customaudio}')
const selectRandomAudioFile = async (path) => {
  //gra the array of files
  const fileList = await listFiles(path)
  //generate a random number from array 0 to length
  const randomIndex = randomNumber(fileList.length);

  // Return the chosen random file path
  return fileList[randomIndex].path
}
}

module.exports = {
    randomaudio
}
