const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();

const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { loadPageRoutes } = require("../routes/page.routes")
const { loadApiRoutes } = require("../routes/config.api")


/**
 *  Create the express webserver
 * @returns {*|Express}
 */
const createWebServer = () => {
    injectMiddleware();
    loadPageRoutes(app);
    loadApiRoutes(app);
    return app;
}
/**
 * Starts the express webserver on port 3000
 */
const startWebServer = () => {
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}
/**
 * Inject all common middleware into express server
 */
const injectMiddleware = () => {
    app.set('views', TEMPLATE_CONSTANTS().TEMPLATES_FOLDER);
    app.set('view engine', 'ejs');
    app.use(expressLayouts);
    app.use(express.json())
}


module.exports = {
    createWebServer,
    startWebServer
};
