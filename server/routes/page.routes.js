const PATH_CONSTANTS = require("../constants/path.constants");

const loadPageRoutes = (app) => {
    /**
     *
     */
    app.get('/', (req, res) => {
        // Render the specific ejs template view
        res.render(PATH_CONSTANTS().PAGES_FOLDER + "home", {
            layout: PATH_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Home" //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
        });
    });

    /**
     *
     */
    app.get('/config', (req, res) => {
        // Render the specific ejs template view
        res.render(PATH_CONSTANTS().PAGES_FOLDER + "config", {
            layout: PATH_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Config"
        });
    });

    /**
     *
     */
    app.get('/themes', (req, res) => {
        // Render the specific ejs template view
        res.render(PATH_CONSTANTS().PAGES_FOLDER + "themes", {
            layout: PATH_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Themes"
        });
    });

    /**
     *
     */
    app.get('/updates', (req, res) => {
        // Render the specific ejs template view
        res.render(PATH_CONSTANTS().PAGES_FOLDER + "update", {
            layout: PATH_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Updates"
        });
    });
}

module.exports = { loadPageRoutes }