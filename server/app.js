const { createWebServer, startWebServer } = require("../server/modules/web-server.module");
const { setupConfigurationFile } = require("../server/modules/config-loader.module");
const { selectRandomAudioFile } = require("../server/generators/utils/randomaudio.utils");
const { GENERATION } = require("../server/modules/generators.module");
const logger = require("../server/utils/logger.utils");

const { deleteFoldersOnShutdown, createrequiredstartupfolders, copyResources } = require("../server/modules/startup-shutdown.module");
const { version } = require('../package.json');

// Register a handler for the 'exit' event
process.on('exit', () => {
  logger.info('Application is exiting.');
  deleteFoldersOnShutdown();
});

// Register a handler for the 'SIGINT' (Ctrl+C) signal
process.on('SIGINT', () => {
  logger.info('Received SIGINT signal (Ctrl+C).');
  deleteFoldersOnShutdown();
  process.exit(1); // Forcefully exit the application
});

// Register a handler for the 'SIGTERM' signal
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM signal.');
  deleteFoldersOnShutdown();
  process.exit(1); // Forcefully exit the application
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  // Perform any necessary cleanup or logging here
  // Terminate the process (optional)
  //process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  // Perform any necessary cleanup or logging here

  // Terminate the process (optional)
  //process.exit(1);
});

// Rest of your Node.js application code...


//This is called a self executing function. It allows us to create an application context for our app, and also start it asynchronously
(async function(){
    // Very basic splitting up of concerns, now we can use this entry point app and create and manage our modules for configs.
    // Also very basic global error caching for the entire application, might still completely stall if not careful but can be improved at a later date.

    try {
      logger.info(`Current ErsatzTV-Filler version: ${version}`)
      await createrequiredstartupfolders();

        await setupConfigurationFile();


       await createWebServer();

        await startWebServer();


        await copyResources();

      await GENERATION();

//      const interval = 2000;

// Function to run selectRandomAudioFile every 5 seconds
//const runSelectRandomAudioFile = async () => {
//  try {
//    const randomAudioFile = await selectRandomAudioFile("/Volumes/Media/Music");
//    console.log(`Selected Audio File: ${randomAudioFile}`);
//  } catch (error) {
//    console.error("Error selecting a random audio file:", error);
//  }
//};

// Set up the interval to run the function every 5 seconds
//const intervalId = setInterval(runSelectRandomAudioFile, interval);


    } catch(e){
        logger.error("Fatal error occurred!", e)
    }
})()
