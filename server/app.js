const { createWebServer, startWebServer } = require("../server/modules/web-server.module");
const { setupConfigurationFile } = require("../server/modules/config-loader.module");
const { selectRandomAudioFile } = require("../server/generators/utils/randomaudio.utils");
const { GENERATION } = require("../server/modules/generators.module");
const logger = require("../server/utils/logger.utils");
const moment = require('moment-timezone');



// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Perform any necessary cleanup or logging here
  // Terminate the process (optional)
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  // Perform any necessary cleanup or logging here

  // Terminate the process (optional)
  process.exit(1);
});

// Rest of your Node.js application code...


//This is called a self executing function. It allows us to create an application context for our app, and also start it asynchronously
(async function(){
    // Very basic splitting up of concerns, now we can use this entry point app and create and manage our modules for configs.
    // Also very basic global error caching for the entire application, might still completely stall if not careful but can be improved at a later date.

    try {
        await setupConfigurationFile();


       createWebServer();

        startWebServer();

        GENERATION();

    } catch(e){
        logger.error("Fatal error occurred!", e)
    }
})()
