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
const { encryptText, decryptText, readAndDecryptPassword } = require("../utils/encryption.utils")
const { retrieveThemelists } = require("../utils/themes.utils")
const { asssubstitution } = require("../utils/string.utils");
const randomQuotes = require('random-quotes');



const loadPageRoutes = async (app) => {
  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Page routes Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    if (req.accepts('html')) {
    // Render an error HTML page
    res.status(status).send(`<html><head><style>body { background-color: #4d4d4d; }</style><title>Error</title></head><body><center><br><br><br><h1 style="color: red;">Error: ${status}</h1></center><br><center><h2 style="color: orange;">OOPS, Something went terribly wrong.</h2><br><span style="font-size: 48px;">🙁</span></center></body></html>`);

  } else {
    // Send a JSON response to the client
    res.status(status).json({ error: message });
  }
  });



  //if (!validUsername && !validPassword) {
    //req.session.isAuthenticated = true;
  //}

  // Middleware to check if the user is authenticated
const checkAuthentication = (req, res, next) => {
    const { decryptedUsername, decryptedPassword } = readAndDecryptPassword();
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



  app.get('/', checkAuthentication, async (req, res) => {
    const config_current = await retrieveCurrentConfiguration();
    let UPDATESTATUS = await checkForUpdates();
  const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
    const { oldtypethemes } = await retrieveThemelists()
    logger.info(`old version themes: ${oldtypethemes}`)
    function getRandomQuote() {
    const quote = randomQuotes.default();
    return { body: quote.body, author: quote.author };
}
let weatherprovider = '';
if (config_current.booked_code.length > 0) {
  weatherprovider = 'booked.net';
  // Code for when booked_code has elements
  console.log('booked_code has elements');
} else if (config_current.usewttrin === 'yes' || config_current.country !== 'us') {
  weatherprovider = 'wttr.in';
  // Code for when usewttrin is 'yes' or country is not 'us'
  console.log('usewttrin is yes or country is not us');
} else {
  weatherprovider = 'weatherforyou.net';
  // Code for when none of the conditions are true
  console.log('none of the conditions are true');
}
const randomquote = getRandomQuote()
let html = await changelogReplace()
const $ = cheerio.load(html);
const parent = $('h3').eq(1).parent();
const content = parent.find('h3').eq(1).addClass('expand-button').nextAll();
content.addBack().wrapAll('<div class="expand-content hidden"></div>');
  const ErsatzTVURL = config_current.ersatztv
      res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "home", {
        layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
        version: version,
        ErsatzTVURL: ErsatzTVURL,
        updatestatus: UPDATESTATUS,
        authentication: authentication,
        oldtypethemes: oldtypethemes,
        quote: randomquote,
        markdown: $.html().replace(/<u><center><h1>Changelog<\/h1><\/center><\/u>/g, '').replace(/border-top: 1px solid darkgray/g, 'border-top: none;').replace(/padding-top: 15px;/g, 'padding-top: 0px;'),
        weatherprovider: weatherprovider
   });
});


    app.get('/output', checkAuthentication, async (req, res) => {
      const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
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
        const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
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
      const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
      const config_current = await retrieveCurrentConfiguration();
      const { filesinthemesdir, filesinthemesdiruser, filesinthemesdirsystem, oldtypethemes } = await retrieveThemelists()
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = config_current.ersatztv
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes",
            version: version,
            theme: asssubstitution(config_current.theme.replace(/user\//g, "User - ").replace(/system\//g, "System - ")),
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

    app.get('/downloadcenter', checkAuthentication, async (req, res) => {
      const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
      const config_current = await retrieveCurrentConfiguration();
      const { filesinthemesdir, filesinthemesdiruser, filesinthemesdirsystem, oldtypethemes } = await retrieveThemelists()
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = config_current.ersatztv
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "downloadcenter", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Download Center",
            version: version,
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS,
            authentication: authentication,
            oldtypethemes: oldtypethemes
        });
    });

    app.get('/updates', checkAuthentication, async (req, res) => {
        const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
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
        const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
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
        const { decryptedUsername, decryptedPassword, authentication } = await readAndDecryptPassword();
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
