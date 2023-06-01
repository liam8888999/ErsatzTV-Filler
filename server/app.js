const { createWebServer, startWebServer } = require("../server/modules/web-server.module");
const { setupConfigurationFile } = require("../server/modules/config-loader.module");
const { selectRandomAudioFile } = require("../server/generators/utils/randomaudio.utils");
const logger = require("../server/utils/logger.utils");

const { WEATHER } = require("../server/generators/weather.generator");


//This is called a self executing function. It allows us to create an application context for our app, and also start it asynchronously
(async function(){
    // Very basic splitting up of concerns, now we can use this entry point app and create and manage our modules for configs.
    // Also very basic global error caching for the entire application, might still completely stall if not careful but can be improved at a later date.

    try {
        await setupConfigurationFile();

       createWebServer();

        startWebServer();
//selectRandomAudioFile("/Users/liam/Music/Converted by MediaHuman/Music/Aerosmith/Pump");
       WEATHER();
    } catch(e){
        logger.error("Fatal error occurred!", e)
    }
})()
