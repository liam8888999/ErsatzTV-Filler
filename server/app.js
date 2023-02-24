const { createWebServer, startWebServer } = require("../server/modules/web-server.module");
const { setupConfigurationFile } = require("../server/modules/config-loader.module");

const { WEATHER } = require("../server/generators/weather.generator");


//This is called a self executing function. It allows us to create an application context for our app, and also start it asynchronously
(async function(){
    // Very basic splitting up of concerns, now we can use this entry point app and create and manage our modules for configs.
    // Also very basic global error caching for the entire application, might still completely stall if not careful but can be improved at a later date.

    try {
        await setupConfigurationFile();

       createWebServer();

        startWebServer();

    //    WEATHER();
    } catch(e){
        console.error("Fatal error occurred!", e)
    }
})()
