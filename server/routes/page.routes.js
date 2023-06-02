const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");
const { generateReadMe, changelogReplace, generateChangelog } = require("../utils/markdown.utils")
const { listFilesInDir } = require("../utils/file.utils")
const { version } = require('../../package.json');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require("../utils/logger.utils");
const readline = require('readline');
const moment = require('moment-timezone');


const loadPageRoutes = (app) => {
  app.get('/', async (req, res) => {
    let html = await changelogReplace()
    const $ = cheerio.load(html);
  const parent = $('h3').eq(1).parent();
  const content = parent.find('h3').eq(1).addClass('expand-button').nextAll();
  content.addBack().wrapAll('<div class="expand-content hidden"></div>');
  let config_current = await retrieveCurrentConfiguration()
  let ersatz = config_current.xmltv
  let ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
      res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "home", {
        markdown: $.html(),
        layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
        version: version,
        ErsatzTVURL: ErsatzTVURL
   });

  });

    app.get('/config', async (req, res) => {
      let config_current = await retrieveCurrentConfiguration()
      let ersatz = config_current.xmltv
      let ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "config", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Config",
            CURRENT_CONFIG: config_current,
            version: version, //sending the current configuration to the ejs template.
            ErsatzTVURL: ErsatzTVURL
        });
    });

    app.get('/themes', async (req, res) => {
      let config_current = await retrieveCurrentConfiguration()
      let filesinthemesdir = await listFilesInDir("themes/system")
  .catch(error => {
    logger.error(`Error: ${error}`);
  });
      let ersatz = config_current.xmltv
      let ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes",
            version: version,
            theme: config_current.theme,
            ErsatzTVURL: ErsatzTVURL,
            downloadedthemeslist: filesinthemesdir
        });
    });

    app.get('/updates', async (req, res) => {
      let config_current = await retrieveCurrentConfiguration()
      let ersatz = config_current.xmltv
      let ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "update", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Updates",
            version: version,
            ErsatzTVURL: ErsatzTVURL
        });
    });



//start logs page
    app.get('/logs', async (req, res) => {
      let config_current = await retrieveCurrentConfiguration()
      let ersatz = config_current.xmltv
      let ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "logs", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Logs",
            version: version,
            ErsatzTVURL: ErsatzTVURL
        });
    });
// Define a route to stream the logs in real-time
app.get('/logsload', (req, res) => {
  try {
    const logFile = getLatestLogFile();

    if (!fs.existsSync(logFile)) {
      res.status(404).send('Log file not found');
      return;
    }

    const logStream = fs.createReadStream(logFile);

    // Handle error event for logStream
    logStream.on('error', (error) => {
      res.status(500).send('Error reading log file');
      logger.error(error);
    });

    const rl = readline.createInterface({
      input: logStream,
      terminal: false
    });

    // Add "line" event listener
    rl.on('line', (line) => {
      try {
        res.write(`<p>${line}</p>\n`);
      } catch (err) {
        console.error('An error occurred while processing a line:', err);
        // Handle the error as needed
      }
    });

    // Add "error" event listener
    rl.on('error', (err) => {
      console.error('An error occurred in the readline interface:', err);
      // Handle the error as needed
    });

    // End the response when reading is complete
    rl.on('close', () => {
      res.end();
    });
  } catch (error) {
    res.status(500).send('Error getting log file');
    logger.error(error);
  }
});

function getLatestLogFile() {
  try {
    const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;


console.log(`${formattedDate}`);

//console.log(formattedDate)
    const logFile = `ersatztv-filler-${formattedDate}.log`;
    return logFile;
  } catch (error) {
    throw new Error('Error getting log file');
  }
}


//end logs page



    app.get('/documentation', async (req, res) => {
let documentation = await generateReadMe()
let config_current = await retrieveCurrentConfiguration()
let ersatz = config_current.xmltv
let ErsatzTVURL = ersatz.replace("/iptv/xmltv.xml", "");
  res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "documentation", {
          documentation: documentation,
          layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
          page: "Documentation", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
          version: version,
          ErsatzTVURL: ErsatzTVURL
     });

    });
}



module.exports = { loadPageRoutes }
