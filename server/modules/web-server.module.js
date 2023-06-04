const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');

const { TEMPLATE_CONSTANTS } = require("../constants/path.constants");
const { loadPageRoutes } = require("../routes/page.routes");
const { loadApiConfigRoutes } = require("../routes/config.api");
const { loadApiThemeRoutes } = require("../routes/themes.api")
const { loadApirunRoutes } = require("../routes/run.api");

const os = require('os');


/**
 *  Create the express webserver
 * @returns {*|Express}
 */
const createWebServer = () => {
    injectMiddleware();
    loadPageRoutes(app);
    loadApiConfigRoutes(app);
    loadApiThemeRoutes(app);
    loadApirunRoutes(app);

    // Log system information
    const systemInfo = {
      platform: os.platform(),
      hostname: os.hostname(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus(),
      loadAverage: os.loadavg()
    };

logger.info(`System Information: ${JSON.stringify(systemInfo, null, 2)}`);



    return app;
}
/**
 * Starts the express webserver on port 3000
 */
const startWebServer = () => {
    app.listen(3000, () => {
        logger.info('Server started on port 3000');
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
