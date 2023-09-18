const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');

const { TEMPLATE_CONSTANTS, WORKDIR } = require("../constants/path.constants");
const { loadPageRoutes } = require("../routes/page.routes");
const { loadApiConfigRoutes } = require("../routes/config.api");
const { loadApiThemeRoutes } = require("../routes/themes.api")
const { loadApirunRoutes } = require("../routes/run.api");
const { loadApihealthRoutes } = require("../routes/health.api");
const { loadApimediaRoutes } = require("../routes/media.api");
const { loadApilogsRoutes } = require("../routes/logs.api");
const { loadApixmltvmergeRoutes } = require("../routes/xmltvmerge.api");
const os = require('os');
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { createDirectoryIfNotExists } =require("../utils/file.utils")


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
    loadApihealthRoutes(app);
    loadApimediaRoutes(app);
    loadApilogsRoutes(app);
    loadApixmltvmergeRoutes(app);
    createDirectoryIfNotExists(WORKDIR);

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
 const startWebServer = async () => {
   const config_current = await retrieveCurrentConfiguration()
   const port = await config_current.webport;
   app.listen(`${port}`, () => {
     logger.info(`Server started on port ${port}`);
   });
 };
/**
 * Inject all common middleware into express server
 */
 const injectMiddleware = () => {
   app.set('views', TEMPLATE_CONSTANTS().TEMPLATES_FOLDER);
   app.set('view engine', 'ejs');
   app.set('view cache', false);
   app.use(expressLayouts);
   app.use(express.json());
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(session({
     secret: '1JIdfqkdCMdA8zIJvCRfTENtIIwzthoP', // Change this to a long random string
     resave: 'false',
     saveUninitialized: 'true',
     sameSite: 'lax',
     maxAge: '172800000',
     path: '/'
   }));
 };



module.exports = {
    createWebServer,
    startWebServer
};
