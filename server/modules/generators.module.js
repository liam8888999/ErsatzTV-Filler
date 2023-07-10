const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const { NEWS } = require("../generators/news.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { VANITYCARDS } = require("../generators/vanitycards.generator");
const { NEWS } = require("../generators/news.generator");
const { WEATHER } = require("../generators/weather.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const CronJobManager = require('cron-job-manager');
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");

const GENERATION = async () => {
  const config_current = await retrieveCurrentConfiguration();

  const manager = new CronJobManager();

  const startCronVanity = async (interval) => {
    manager.add('vanity', interval, async () => {
      logger.info(`Running Vanity Cards generation at ${new Date()}`);
      logger.info(`${await manager}`)
      await VANITYCARDS();
      // Update the interval
      const config_current = await retrieveCurrentConfiguration();
      interval = config_current.vanityinterval || ;
      // Restart the cron job with the updated interval
      manager.update('vanity', interval)
      console.log(`Vanity Cards Generation completed at ${new Date()}`);
    });
    manager.start('vanity');
  };

  const startCronWeather = async (interval) => {
    manager.add('weather', interval, async () => {
      logger.info(`Running Weather generation at ${new Date()}`);
      logger.info(`${await manager}`)
      await WEATHER();
      // Update the interval
      const config_current = await retrieveCurrentConfiguration();
      interval = config_current.weatherinterval || ;
      // Restart the cron job with the updated interval
      manager.update('weather', interval)
      console.log(`Weather Generation completed at ${new Date()}`);
    });
    manager.start('weather');
  };

  const startCronNews = async (interval) => {
    manager.add('news', interval, async () => {
      logger.info(`Running News generation at ${new Date()}`);
      logger.info(`${await manager}`)
      await NEWS();
      // Update the interval
      const config_current = await retrieveCurrentConfiguration();
      interval = config_current.newsinterval || ;
      // Restart the cron job with the updated interval
      manager.update('news', interval)
      console.log(`News Generation completed at ${new Date()}`);
    });
    manager.start('news');
  };

  const startCronOffline = async (interval) => {
    manager.add('offline', interval, async () => {
      logger.info(`Running Channel-Offline generation at ${new Date()}`);
      logger.info(`${await manager}`)
      await CHANNEL_OFFLINE();
      // Update the interval
      const config_current = await retrieveCurrentConfiguration();
      interval = config_current.offlineinterval || ;
      // Restart the cron job with the updated interval
      manager.update('offline', interval)
      console.log(`Channel-Offline Generation completed at ${new Date()}`);
    });
    manager.start('offline');
  };

  const startCronmerge = async (interval) => {
    manager.add('merge', interval, async () => {
      logger.info(`Running XMLTV Merge generation at ${new Date()}`);
      logger.info(`${await manager}`)
      await XMLTVPARSE();
      // Update the interval
      const config_current = await retrieveCurrentConfiguration();
      interval = config_current.xmltvmergeinterval || ;
      // Restart the cron job with the updated interval
      manager.update('merge', interval)
      console.log(`XMLTV Merge Generation completed at ${new Date()}`);
    });
    manager.start('merge');
  };

  // Start the initial cron job
  await startCronVanity(config_current.vanityinterval);
  await startCronWeather(config_current.weatherinterval);
  await startCronNews(config_current.newsinterval);
  await startCronOffline(config_current.offlineinterval);
  await startCronmerge(config_current.xmltvmergeinterval);
};

module.exports = {
  GENERATION
};
