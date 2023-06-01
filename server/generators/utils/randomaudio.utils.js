const { listFilesInDir } = require("../../utils/file.utils")
const { randomNumber } = require("../../utils/randomnumber.utils")

const selectRandomAudioFile = async (path) => {
  //gra the array of files
  const fileList = await listFilesInDir(path)
  //console.log(fileList)
  //generate a random number from array 0 to length

  const randomIndex = randomNumber(fileList.length);
  //console.log(randomIndex)

const listFile = await fileList[randomIndex]
  // Return the chosen random file path
  //  console.log(listFile)
  return listFile
}

module.exports = {
    selectRandomAudioFile
}
