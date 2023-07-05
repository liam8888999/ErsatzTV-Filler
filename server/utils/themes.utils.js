const fs = require("fs")
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');

const settheme = async (theme) => {
  try {
    const fileData = await fs.readFileSync("config.json");
    const json = JSON.parse(fileData);
    json.theme = theme;
    await fs.writeFileSync("config.json", JSON.stringify(json, null, 2));
    logger.success(`Successfully updated theme to '${theme}' in config.json`);
  } catch (err) {
    logger.error(`Error updating theme to '${theme}' in config.json: ${err}`);
  }
}


const themecolourdecoder = (colour) => {

//  const colour = `${colourin}`;

  // Extracting individual color components
  const red = parseInt(colour.substring(0, 2), 16);
  const green = parseInt(colour.substring(2, 4), 16);
  const blue = parseInt(colour.substring(4, 6), 16);

  // Creating the RGB color code
  const themeColour = `${blue.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${red.toString(16).padStart(2, '0')}`;


  console.log(themeColour);



     return themeColour
 }

module.exports = {
    settheme,
    themecolourdecoder
}
