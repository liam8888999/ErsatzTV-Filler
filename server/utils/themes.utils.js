const {fs} = require("fs")

async function settheme(theme) {
  try {
    const fileData = await fs.promises.readFile("config.json");
    const json = JSON.parse(fileData);
    json.theme = theme;
    await fs.promises.writeFile("config.json", JSON.stringify(json, null, 2));
    console.log(`Successfully updated theme to '${theme}' in config.conf`);
  } catch (err) {
    console.error(`Error updating theme to '${theme}' in config.json: ${err}`);
  }
}

module.exports = {
    settheme
}
