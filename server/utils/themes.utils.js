const fs = require("fs")
const logger = require("../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { downloadImage } = require("../utils/downloadimage.utils");
const { doesFileExist, loadFileContentsIntoMemory } = require("../utils/file.utils");
const { THEMES_FOLDER, CONFIG_CONSTANTS, CURRENT_THEME_VERSION } = require("../constants/path.constants");
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const path = require('path');
const { asssubstitution } = require("../utils/string.utils");
const { listFilesInDir } = require("../utils/file.utils")


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
     logger.success("Found the user selected theme file... loading...");
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
     logger.info(`Theme data original: ${themedata}`);
     logger.error(`The theme is not version ${CURRENT_THEME_VERSION}, fallback for the missing items will be used`);
     // Add the ThemeVersion property here
     themedata.ChannelLogo = {
      channellogobackgroundcolour: '000000'
    };
     logger.info(`Theme data edited: ${themedata}`);
     return themedata;
   }
 };



 const findOldVersionThemeFilesRecursively = (folderPath) => {
   try {
     const files = fs.readdirSync(folderPath);
     const filteredFiles = [];

     for (const file of files) {
       const filePath = path.join(folderPath, file);
       const stat = fs.statSync(filePath);

       if (stat.isDirectory()) {
         // If it's a directory, recursively call the function
         const subfolderFiles = findOldVersionThemeFilesRecursively(filePath);
         filteredFiles.push(...subfolderFiles);
       } else if (path.extname(file).toLowerCase() === '.theme') {
         // If it's a .theme file, read and filter JSON content
         try {
           const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
           if (fileContent?.ErsatzTVFillerTheme?.ThemeVersion !== CURRENT_THEME_VERSION) {
             // Extract just the last folder and the file name
             const parts = folderPath.split(path.sep);
             const lastFolder = parts[parts.length - 1];
             filteredFiles.push(path.join(lastFolder, file));
           }
         } catch (error) {
           logger.error(`Error reading or parsing JSON file ${file}: ${error}`);
           // You can choose to skip files with errors or handle them differently
         }
       }
     }

     return filteredFiles;
   } catch (error) {
     logger.error(`Error reading folder: ${error}`);
     return [];
   }
 };

 const findoldVersionThemeFiles = () => {
   const folderPath = THEMES_FOLDER; // Replace with the actual path to your folder
   const filteredFiles = findOldVersionThemeFilesRecursively(folderPath);

   return filteredFiles;
 };







const retrieveThemelists = async () => {
 let filesinthemesdirorig = await listFilesInDir(THEMES_FOLDER)
.catch(error => {
logger.error(`Error listing files in themes dir: ${error}`);
});
console.log(filesinthemesdirorig)
let filesinthemesdir2 = asssubstitution(`${filesinthemesdirorig.join(',')}`).split(',')
const filesinthemesdir = filesinthemesdir2.map(item => {
  const parts = item.split('/');
  const lastTwoFields = parts.slice(-2).join('/');
  if (parts.length > 1) {
  return '/' + lastTwoFields;
}
  return lastTwoFields; // Add back the leading '/'
});
console.log(filesinthemesdirorig)

let filesinthemesdiruserorig = await listFilesInDir(`${path.join(THEMES_FOLDER, 'user')}`)
.catch(error => {
logger.error(`Error listing files in themes user dir: ${error}`);
});
let filesinthemesdiruser2 = asssubstitution(filesinthemesdiruserorig.join(',')).split(',')
const filesinthemesdiruser = filesinthemesdiruser2.map(item => {
  const parts = item.split('/');
  const lastTwoFields = parts.slice(-2).join('/');
  if (parts.length > 1) {
  return '/' + lastTwoFields;
}
  return lastTwoFields; // Add back the leading '/'
});
let filesinthemesdirsystemoriginal = await listFilesInDir(`${path.join(THEMES_FOLDER, 'system')}`)
.catch(error => {
logger.error(`Error listing files in themes system dir: ${error}`);
});

let filesinthemesdirsystem2 = asssubstitution(filesinthemesdirsystemoriginal.join(',')).split(",")
const filesinthemesdirsystem = filesinthemesdirsystem2.map(item => {
  const parts = item.split('/');
  const lastTwoFields = parts.slice(-2).join('/');
  if (parts.length > 1) {
  return '/' + lastTwoFields;
}
  return lastTwoFields; // Add back the leading '/'
});
const oldtypethemes = await findoldVersionThemeFiles()
return {
  filesinthemesdir,
  filesinthemesdiruser,
  filesinthemesdirsystem,
  oldtypethemes
};
}



module.exports = {
    settheme,
    themecolourdecoder,
    retrieveCurrentTheme,
    findoldVersionThemeFiles,
    retrieveThemelists
}
