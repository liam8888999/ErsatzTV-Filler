const { TEMPLATE_CONSTANTS, THEMES_FOLDER, PASSWORD } = require("../constants/path.constants");
const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");
const { changelogReplace, generateChangelog } = require("../utils/markdown.utils")
const { listFilesInDir } = require("../utils/file.utils")
const { version } = require('../../package.json');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require("../utils/logger.utils");
const readline = require('readline');
const { checkForUpdates } = require('../utils/update.utils');
const path = require('path');
const { encryptText, decryptText } = require("../utils/encryption.utils")
const { findoldVersionThemeFiles } = require("../utils/themes.utils")



const loadPageRoutes = async (app) => {




  //if (!validUsername && !validPassword) {
    //req.session.isAuthenticated = true;
  //}

  // Middleware to check if the user is authenticated
const checkAuthentication = (req, res, next) => {
  let decryptedUsername;
  let decryptedPassword;
    try {
      const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

      // Decrypt the username and password
      decryptedUsername = decryptText(
        passwordData.encryptedusername.encryptedText,
        passwordData.encryptedusername.iv.data,
        passwordData.encryptedusername.encryptionKey.data
      );
      decryptedPassword = decryptText(
        passwordData.encryptedpassword.encryptedText,
        passwordData.encryptedpassword.iv.data,
        passwordData.encryptedpassword.encryptionKey.data
      );

    } catch (error) {
      // Handle the error encountered when reading or decrypting the password file
      decryptedUsername = ''
      decryptedPassword = ''

      logger.error("No password file is found in the config dir");
    }
  if (!decryptedUsername && !decryptedPassword) {
    req.session.isAuthenticated = true;
    return next();
  }
  if (req.session.isAuthenticated) {
    // User is authenticated; continue to the next middleware or route handler
    return next();
  } else {

  res.redirect('/login');
    // User is not authenticated; redirect to the login page
  }
};

  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Page routes Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    res.status(status).json({ error: message });
  });



  app.get('/', checkAuthentication, async (req, res) => {
    const config_current = await retrieveCurrentConfiguration();
    let UPDATESTATUS = await checkForUpdates();
    let decryptedUsername;
    let decryptedPassword;
      try {
        const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

        // Decrypt the username and password
        decryptedUsername = decryptText(
          passwordData.encryptedusername.encryptedText,
          passwordData.encryptedusername.iv.data,
          passwordData.encryptedusername.encryptionKey.data
        );
        decryptedPassword = decryptText(
          passwordData.encryptedpassword.encryptedText,
          passwordData.encryptedpassword.iv.data,
          passwordData.encryptedpassword.encryptionKey.data
        );

      } catch (error) {
        // Handle the error encountered when reading or decrypting the password file
        decryptedUsername = ''
        decryptedPassword = ''

        logger.error("No password file is found in the config dir");
      }
    let authentication;
    if (!decryptedUsername && !decryptedPassword) {
      authentication = 'no'
    } else {
      authentication = 'yes';
    }
    const oldtypethemes = findoldVersionThemeFiles()
    logger.info(`old version themes: ${oldtypethemes}`)
  const ErsatzTVURL = config_current.ersatztv
      res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "home", {
        layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
        version: version,
        ErsatzTVURL: ErsatzTVURL,
        updatestatus: UPDATESTATUS,
        authentication: authentication,
        oldtypethemes: oldtypethemes
   });
});


    app.get('/output', checkAuthentication, async (req, res) => {
      let decryptedUsername;
      let decryptedPassword;
        try {
          const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

          // Decrypt the username and password
          decryptedUsername = decryptText(
            passwordData.encryptedusername.encryptedText,
            passwordData.encryptedusername.iv.data,
            passwordData.encryptedusername.encryptionKey.data
          );
          decryptedPassword = decryptText(
            passwordData.encryptedpassword.encryptedText,
            passwordData.encryptedpassword.iv.data,
            passwordData.encryptedpassword.encryptionKey.data
          );

        } catch (error) {
          // Handle the error encountered when reading or decrypting the password file
          decryptedUsername = ''
          decryptedPassword = ''

          logger.error("No password file is found in the config dir");
        }
      let authentication;
      if (!decryptedUsername && !decryptedPassword) {
        authentication = 'no'
      } else {
        authentication = 'yes';
      }
      const config_current = await retrieveCurrentConfiguration();
      let UPDATESTATUS = await checkForUpdates();
    const ErsatzTVURL = config_current.ersatztv
    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = config_current.webport;
    const fullUrl = `${protocol}://${host}:${port}`
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "output", {
          layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
          page: "Output", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
          version: version,
          ErsatzTVURL: ErsatzTVURL,
          updatestatus: UPDATESTATUS,
          currenturl: fullUrl,
          authentication: authentication
     });

    });



    app.get('/config', checkAuthentication, async (req, res) => {
      let decryptedUsername;
      let decryptedPassword;
        try {
          const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

          // Decrypt the username and password
          decryptedUsername = decryptText(
            passwordData.encryptedusername.encryptedText,
            passwordData.encryptedusername.iv.data,
            passwordData.encryptedusername.encryptionKey.data
          );
          decryptedPassword = decryptText(
            passwordData.encryptedpassword.encryptedText,
            passwordData.encryptedpassword.iv.data,
            passwordData.encryptedpassword.encryptionKey.data
          );

        } catch (error) {
          // Handle the error encountered when reading or decrypting the password file
          decryptedUsername = ''
          decryptedPassword = ''

          logger.error("No password file is found in the config dir");
        }
      let authentication;
      if (!decryptedUsername && !decryptedPassword) {
        authentication = 'no'
      } else {
        authentication = 'yes';
      }
      const config_current = await retrieveCurrentConfiguration();
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = config_current.ersatztv
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "config", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Config",
            CURRENT_CONFIG: config_current,
            version: version, //sending the current configuration to the ejs template.
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS,
            authentication: authentication
        });
    });

    app.get('/themes', checkAuthentication, async (req, res) => {
      let decryptedUsername;
      let decryptedPassword;
        try {
          const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

          // Decrypt the username and password
          decryptedUsername = decryptText(
            passwordData.encryptedusername.encryptedText,
            passwordData.encryptedusername.iv.data,
            passwordData.encryptedusername.encryptionKey.data
          );
          decryptedPassword = decryptText(
            passwordData.encryptedpassword.encryptedText,
            passwordData.encryptedpassword.iv.data,
            passwordData.encryptedpassword.encryptionKey.data
          );

        } catch (error) {
          // Handle the error encountered when reading or decrypting the password file
          decryptedUsername = ''
          decryptedPassword = ''

          logger.error("No password file is found in the config dir");
        }
      let authentication;
      if (!decryptedUsername && !decryptedPassword) {
        authentication = 'no'
      } else {
        authentication = 'yes';
      }
      const config_current = await retrieveCurrentConfiguration();
      let filesinthemesdir = await listFilesInDir(THEMES_FOLDER)
.catch(error => {
    logger.error(`Error listing files in themes dir: ${error}`);
  });
  let filesinthemesdiruser = await listFilesInDir(`${path.join(THEMES_FOLDER, 'user')}`)
.catch(error => {
logger.error(`Error listing files in themes user dir: ${error}`);
});
let filesinthemesdirsystemoriginal = await listFilesInDir(`${path.join(THEMES_FOLDER, 'system')}`)
.catch(error => {
logger.error(`Error listing files in themes system dir: ${error}`);
});
let joinedString = filesinthemesdirsystemoriginal.join(','); // Join array elements into a single string
let escapedThemesFolder = THEMES_FOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let regexPattern = new RegExp(escapedThemesFolder, 'g');

// Replace the pattern in joinedString
let filesinthemesdirsystemcorrect = joinedString.replace(regexPattern, "");
let filesinthemesdirsystem = filesinthemesdirsystemcorrect.split(",")
const oldtypethemes = findoldVersionThemeFiles()
logger.info(`Files in themes system dir: ${filesinthemesdirsystem}`)
logger.info(`Files in themes dir: ${JSON.stringify(filesinthemesdiruser)}`)
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = config_current.ersatztv
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes",
            version: version,
            theme: config_current.theme.replace(/user\//g, "User - ").replace(/system\//g, "System - "),
            themeunreplaced: config_current.theme,
            ErsatzTVURL: ErsatzTVURL,
            downloadedthemeslist: filesinthemesdir,
            downloadedthemesarray: filesinthemesdiruser,
            downloadedthemesarraysystem: filesinthemesdirsystem,
            updatestatus: UPDATESTATUS,
            authentication: authentication,
            oldtypethemes: oldtypethemes
        });
    });

    app.get('/updates', checkAuthentication, async (req, res) => {
      let decryptedUsername;
      let decryptedPassword;
        try {
          const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

          // Decrypt the username and password
          decryptedUsername = decryptText(
            passwordData.encryptedusername.encryptedText,
            passwordData.encryptedusername.iv.data,
            passwordData.encryptedusername.encryptionKey.data
          );
          decryptedPassword = decryptText(
            passwordData.encryptedpassword.encryptedText,
            passwordData.encryptedpassword.iv.data,
            passwordData.encryptedpassword.encryptionKey.data
          );

        } catch (error) {
          // Handle the error encountered when reading or decrypting the password file
          decryptedUsername = ''
          decryptedPassword = ''

          logger.error("No password file is found in the config dir");
        }
      let authentication;
      if (!decryptedUsername && !decryptedPassword) {
        authentication = 'no'
      } else {
        authentication = 'yes';
      }
      const config_current = await retrieveCurrentConfiguration();
      const ErsatzTVURL = config_current.ersatztv
      let UPDATESTATUS = await checkForUpdates();
      let html = await changelogReplace()
      const $ = cheerio.load(html);
    const parent = $('h3').eq(1).parent();
    const content = parent.find('h3').eq(1).addClass('expand-button').nextAll();
    content.addBack().wrapAll('<div class="expand-content hidden"></div>');
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "update", {
          markdown: $.html(),
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Updates",
            version: version,
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS,
            authentication: authentication
        });
    });



    app.get('/logs', checkAuthentication, async (req, res) => {
      let decryptedUsername;
      let decryptedPassword;
        try {
          const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

          // Decrypt the username and password
          decryptedUsername = decryptText(
            passwordData.encryptedusername.encryptedText,
            passwordData.encryptedusername.iv.data,
            passwordData.encryptedusername.encryptionKey.data
          );
          decryptedPassword = decryptText(
            passwordData.encryptedpassword.encryptedText,
            passwordData.encryptedpassword.iv.data,
            passwordData.encryptedpassword.encryptionKey.data
          );

        } catch (error) {
          // Handle the error encountered when reading or decrypting the password file
          decryptedUsername = ''
          decryptedPassword = ''

          logger.error("No password file is found in the config dir");
        }
      let authentication;
      if (!decryptedUsername && !decryptedPassword) {
        authentication = 'no'
      } else {
        authentication = 'yes';
      }
      const config_current = await retrieveCurrentConfiguration();
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = config_current.ersatztv
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "logs", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Logs",
            version: version,
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS,
            authentication: authentication
        });
    });



    app.get('/themecreator', checkAuthentication, async (req, res) => {
      const config_current = await retrieveCurrentConfiguration();
      let UPDATESTATUS = await checkForUpdates();
      let decryptedUsername;
      let decryptedPassword;
        try {
          const passwordData = JSON.parse(fs.readFileSync(PASSWORD));

          // Decrypt the username and password
          decryptedUsername = decryptText(
            passwordData.encryptedusername.encryptedText,
            passwordData.encryptedusername.iv.data,
            passwordData.encryptedusername.encryptionKey.data
          );
          decryptedPassword = decryptText(
            passwordData.encryptedpassword.encryptedText,
            passwordData.encryptedpassword.iv.data,
            passwordData.encryptedpassword.encryptionKey.data
          );

        } catch (error) {
          // Handle the error encountered when reading or decrypting the password file
          decryptedUsername = ''
          decryptedPassword = ''

          logger.error("No password file is found in the config dir");
        }
      let authentication;
      if (!decryptedUsername && !decryptedPassword) {
        authentication = 'no'
      } else {
        authentication = 'yes';
      }
    const ErsatzTVURL = config_current.ersatztv
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "creator", {
          layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
          page: "Home", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
          version: version,
          ErsatzTVURL: ErsatzTVURL,
          updatestatus: UPDATESTATUS,
          authentication: authentication
     });
    });

    };



module.exports = { loadPageRoutes }
