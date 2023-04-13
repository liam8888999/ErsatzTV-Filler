const fs = require("fs")

const settheme = async (theme) => {
  try {
    const fileData = await fs.readFileSync("config.json");
    const json = JSON.parse(fileData);
    json.theme = theme;
    await fs.writeFileSync("config.json", JSON.stringify(json, null, 2));
    console.log(`Successfully updated theme to '${theme}' in config.json`);
  } catch (err) {
    console.error(`Error updating theme to '${theme}' in config.json: ${err}`);
  }
}

const userThemesList => {

const folderPath = 'themes/';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const fileList = [];

  files.forEach(file => {
    fileList.push(file);
  });

  // Do something with the fileList constant here
  console.log(fileList);
});
}

module.exports = {
    settheme
    userThemesList
}
