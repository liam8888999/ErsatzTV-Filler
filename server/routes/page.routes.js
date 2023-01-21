const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { generateChangelog } = require("../utils/markdown.utils")

const loadPageRoutes = (app) => {
  app.get('/', async (req, res) => {
    let html = await generateChangelog()
    console.log("original html")
    console.log(html)
  html = html.replace(/<p>All notable changes to this project will be documented in this file.<\/p>/g, "").replace(/<p>The format is based on <a href=.*>Keep a Changelog<\/a>,<\/p>/g, "");
    console.log("changed html")
      console.log(html)
      res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "home", {
        markdown: html,
        layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home" //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
   });

  });

    app.get('/config', (req, res) => {
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "config", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Config",
            CURRENT_CONFIG: retrieveCurrentConfiguration() //sending the current configuration to the ejs template.
        });
    });

    app.get('/themes', (req, res) => {
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes"
        });
    });

    app.get('/updates', (req, res) => {
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "update", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Updates"
        });
    });
}

module.exports = { loadPageRoutes }
