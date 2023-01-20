const { listFilesindir } = require("../../utils/file.utils")

function downloadImage(){}

const filesList = await readdir("${retrieveCurrentConfiguration().customaudio}")

listFiles('path/to/directory')
  .then(files => {
    console.log(files);
  })
  .catch(err => {
    console.error(err);
  });

  const randomNum = Math.floor(Math.random() * (${filesList.Length} - 1 + 1) + 1);
console.log(randomNum);

}

module.exports = {
    randomaudio
}
