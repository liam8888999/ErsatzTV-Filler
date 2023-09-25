const fs = require("fs")
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { downloadImage } = require("../utils/downloadimage.utils");
const { doesFileExist, loadFileContentsIntoMemory } = require("../utils/file.utils");
const { THEMES_FOLDER, CONFIG_CONSTANTS, CURRENT_THEME_VERSION } = require("../constants/path.constants");
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const path = require('path');


const settheme = async (theme) => {
  try {
    const fileData = await fs.readFileSync(CONFIG_CONSTANTS().USER_CONFIG);
    const json = JSON.parse(fileData);
    json.theme = theme;
    await fs.writeFileSync(`${CONFIG_CONSTANTS().USER_CONFIG}`, JSON.stringify(json, null, 2));
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


  logger.info(`Theme colour: ${themeColour}`);



     return themeColour
 }


 const retrieveCurrentTheme = async () => {
   const config_current = await retrieveCurrentConfiguration();
   const themeFileExists = await doesFileExist(`${path.join(THEMES_FOLDER, config_current.theme)}.theme`);

   let usetheme = ''

   if (!themeFileExists) {
     logger.warn(`${config_current.theme}.json file is missing... Falling back to the SystemLight (Default) theme.`);
     await createDirectoryIfNotExists(THEMES_FOLDER);
     await createDirectoryIfNotExists(`${path.join(THEMES_FOLDER, 'system')}`)
     try {
       await downloadImage('https://raw.githubusercontent.com/liam8888999/ErsatzTV-Filler-Themes/main/SystemLight-Theme/SystemLight.theme', `${path.join(THEMES_FOLDER, 'system', 'SystemLight.theme')}`);
     } catch (error) {
       logger.error(`Error downloading Theme (system.light fallback): ${error.message}`);
     }
    await settheme(`${path.join('system', 'SystemLight')}`);
      return await retrieveTheme();
 } else {
     logger.info("Found the user selected theme file... loading...");
     return await retrieveTheme();
   }
 };

 const retrieveTheme = async () => {
   const config_current = await retrieveCurrentConfiguration();
   const data = await fs.readFileSync(`${path.join(THEMES_FOLDER, config_current.theme)}.theme`);
   logger.info(`Current Theme json: ${JSON.parse(data)}`)
    return await checkThemeVersion(JSON.parse(data))
 }

 const checkThemeVersion = async (themedata) => {
   if (themedata.ErsatzTVFillerTheme.ThemeVersion === CURRENT_THEME_VERSION) {
     return themedata;
   } else {
     console.log("themedataoriginal:", themedata);
     logger.error(`The theme is not version ${CURRENT_THEME_VERSION}, fallback for the missing items will be used`);
     // Add the ThemeVersion property here
     themedata.ChannelLogo = {
      channellogobackgroundcolor: '000000'
    };
     console.log("themedataedited:", themedata);
     return themedata;
   }
 };



module.exports = {
    settheme,
    themecolourdecoder,
    retrieveCurrentTheme
}
