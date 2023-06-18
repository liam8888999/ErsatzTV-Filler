const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");
const { generateReadMe, changelogReplace, generateChangelog } = require("../utils/markdown.utils")
const { listFilesInDir } = require("../utils/file.utils")
const { version } = require('../../package.json');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require("../utils/logger.utils");
const readline = require('readline');
const { checkForUpdates } = require('../utils/update.utils');
const path = require('path');



const loadPageRoutes = async (app) => {
const config_current = await retrieveCurrentConfiguration();

  app.get('/', async (req, res) => {
  //  let config_current = await retrieveCurrentConfiguration()
    const ersatz = config_current.xmltv
    let UPDATESTATUS = await checkForUpdates();
  const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
      res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "home", {
        layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
        version: version,
        ErsatzTVURL: ErsatzTVURL,
        updatestatus: UPDATESTATUS
   });

  });


    app.get('/output', async (req, res) => {
      const ersatz = config_current.xmltv
      let UPDATESTATUS = await checkForUpdates();
    const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
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
          currenturl: fullUrl
     });

    });



    app.get('/config', async (req, res) => {
      let UPDATESTATUS = await checkForUpdates();
      const ersatz = config_current.xmltv
      const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "config", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Config",
            CURRENT_CONFIG: config_current,
            version: version, //sending the current configuration to the ejs template.
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS
        });
    });

    app.get('/themes', async (req, res) => {
      let filesinthemesdir = await listFilesInDir("themes/system")
  .catch(error => {
    logger.error(`Error: ${error}`);
  });
      const ersatz = config_current.xmltv
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes",
            version: version,
            theme: config_current.theme,
            ErsatzTVURL: ErsatzTVURL,
            downloadedthemeslist: filesinthemesdir,
            updatestatus: UPDATESTATUS
        });
    });

    app.get('/updates', async (req, res) => {
      const ersatz = config_current.xmltv
      const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
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
            updatestatus: UPDATESTATUS
        });
    });



    app.get('/logs', async (req, res) => {
      let UPDATESTATUS = await checkForUpdates();
      const ersatz = config_current.xmltv
      const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "logs", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Logs",
            version: version,
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS
        });
    });




    app.get('/documentation', async (req, res) => {
      let UPDATESTATUS = await checkForUpdates();
let documentation = await generateReadMe()
const ersatz = config_current.xmltv
const ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
  res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "documentation", {
          documentation: documentation,
          layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
          page: "Documentation", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
          version: version,
          ErsatzTVURL: ErsatzTVURL,
          updatestatus: UPDATESTATUS
     });

    });
}



module.exports = { loadPageRoutes }
