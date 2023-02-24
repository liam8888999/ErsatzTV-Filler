const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");
const { generateReadMe, changelogReplace } = require("../utils/markdown.utils")
const { version } = require('../../package.json');
const fs = require('fs');
const cheerio = require('cheerio')

const loadPageRoutes = (app) => {
  app.get('/', async (req, res) => {
    let html = await changelogGenerator()
    const $ = cheerio.load(html);
  const parent = $('h3').eq(1).parent();
  const content = parent.find('h3').eq(1).addClass('expand-button').nextAll();
  content.addBack().wrapAll('<div class="expand-content hidden"></div>');
      res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "home", {
        markdown: $.html(),
        layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
        version: version
   });

  });

    app.get('/config', async (req, res) => {
      let config_current = await retrieveCurrentConfiguration()
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "config", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Config",
            CURRENT_CONFIG: config_current,
            version: version //sending the current configuration to the ejs template.
        });
    });

    app.get('/themes', (req, res) => {
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes",
            version: version
        });
    });

    app.get('/updates', (req, res) => {
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "update", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Updates",
            version: version
        });
    });

    app.get('/documentation', async (req, res) => {
let documentation = await generateReadMe()

        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "documentation", {
          documentation: documentation,
          layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
          page: "Documentation", //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
          version: version
     });

    });
}



module.exports = { loadPageRoutes }
