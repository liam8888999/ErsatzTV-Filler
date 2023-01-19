const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const fs = require('fs');

const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { loadPageRoutes } = require("../routes/page.routes")


/**
 *
 * @returns {*|Express}
 */
const createWebServer = () => {
    injectMiddleware();
    loadPageRoutes(app);
    //loadApiRoutes(app);
    return app;
}
/**
 *
 */
const startWebServer = () => {
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}
/**
 *
 */
const injectMiddleware = () => {
    app.set('views', TEMPLATE_CONSTANTS().TEMPLATES_FOLDER);
    app.set('view engine', 'ejs');
    app.use(expressLayouts);

    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname));
}


module.exports = {
    createWebServer,
    startWebServer
};