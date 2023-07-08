const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const { NEWS } = require("../generators/news.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { VANITYCARDS } = require("../generators/vanitycards.generator");
const CronJobManager = require('cron-job-manager');
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");




const GENERATION = async () => {



//let generatorInterval = config_current.interval || '*/3 * * * *'
//var task = cron.schedule(generatorInterval, () => {
  //GENERATION();
//});



//await task.stop();

  //logger.info(`running generation now`);
  //task.stop();
  //await WEATHER();
  //await NEWS();
  //await XMLTVPARSE();
  //await CHANNEL_OFFLINE();
//await VANITYCARDS();
//await task.start();


const config_current = await retrieveCurrentConfiguration();
console.log(config_current)

//let generatorInterval = config_current.interval || '*/3 * * * *'; // Initial cron interval
const manager = new CronJobManager();

const startCronJob = async (interval) => {
  console.log(config_current)
  manager.add('generation', interval, async () => {
    console.log(`Running generation at ${new Date()}`);
    console.log(`${manager}`)
    await GENERATIONN();
    console.log(`Generation completed at ${new Date()}`);
    manager.deleteJob('generation'); // Delete the existing job
    startCronJob(`${config_current.interval}`); // Start a new job with updated interval
  });
  manager.start('generation')
};




const GENERATIONN = async () => {
  // Perform your generation tasks here
  // ...
  await VANITYCARDS()
  // Update the generatorInterval variable as needed
};

// Start the initial cron job
await startCronJob(`${config_current.interval}`);

console.log(`${manager}`)
}


module.exports = {
    GENERATION
};
