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
  const config_current = await retrieveCurrentConfiguration();

  const manager = new CronJobManager();

  const startCronVanity = async (interval) => {
    manager.add('vanity', interval, async () => {
      logger.info(`Running Vanity Cards generation at ${new Date()}`);
      logger.info(`${await manager}`)
      const config_current = await retrieveCurrentConfiguration();
      if (config_current.processvanitycards === 'yes') {
      await VANITYCARDS();
    } else {
      logger.info('Not running vanity cards')
    }
      // Update the interval
      interval = `*/${config_current.vanityinterval} * * * *` || '*/10 * * * *';
      // Restart the cron job with the updated interval
      manager.update('vanity', interval)
      logger.success(`Vanity Cards Generation completed at ${new Date()}`);
    });
    manager.start('vanity');
  };

  const startCronWeather = async (interval) => {
    manager.add('weather', interval, async () => {
      logger.info(`Running Weather generation at ${new Date()}`);
      logger.info(`${await manager}`)
      const config_current = await retrieveCurrentConfiguration();
      if (config_current.processweather === 'yes') {
      await WEATHER();
    } else {
      logger.info('Not running WEATHER')
    }
      // Update the interval
      interval = `*/${config_current.weatherinterval} * * * *` || '*/10 * * * *';
      // Restart the cron job with the updated interval
      manager.update('weather', interval)
      logger.success(`Weather Generation completed at ${new Date()}`);
    });
    manager.start('weather');
  };

  const startCronNews = async (interval) => {
    manager.add('news', interval, async () => {
      logger.info(`Running News generation at ${new Date()}`);
      logger.info(`${await manager}`)
      const config_current = await retrieveCurrentConfiguration();
      if (config_current.processnews === 'yes') {
      await NEWS();
    } else {
      logger.info('Not running News')
    }
      // Update the interval
      interval = `*/${config_current.newsinterval} * * * *` || '*/30 * * * *';
      // Restart the cron job with the updated interval
      manager.update('news', interval)
      logger.success(`News Generation completed at ${new Date()}`);
    });
    manager.start('news');
  };

  const startCronOffline = async (interval) => {
    manager.add('offline', interval, async () => {
      logger.info(`Running Channel-Offline generation at ${new Date()}`);
      logger.info(`${await manager}`)
      const config_current = await retrieveCurrentConfiguration();
      if (config_current.processchanneloffline === 'yes') {
      await CHANNEL_OFFLINE();
    } else {
      logger.info('Not running Channel Offline')
    }
      // Update the interval
      interval = `*/${config_current.offlineinterval} * * * *` || '*/5 * * * *';
      // Restart the cron job with the updated interval
      manager.update('offline', interval)
      logger.success(`Channel-Offline Generation completed at ${new Date()}`);
    });
    manager.start('offline');
  };

  const startCronmerge = async (interval) => {
    manager.add('merge', interval, async () => {
      logger.info(`Running XMLTV Merge generation at ${new Date()}`);
      logger.info(`${await manager}`)
      const config_current = await retrieveCurrentConfiguration();
      if (config_current.processxmltvmerger === 'yes') {
          if (typeof config_current.epgfiles === 'undefined' || config_current.epgfiles === '' || config_current.epgfiles === 'null') {
      await XMLTVPARSE();
    }
    } else {
      logger.info('Not running XMLTV Merge')
    }
      // Update the interval
      interval = `*/${config_current.xmltvmergeinterval} * * * *` || '*/20 * * * *';
      // Restart the cron job with the updated interval
      manager.update('merge', interval)
      logger.success(`XMLTV Merge Generation completed at ${new Date()}`);
    });
    manager.start('merge');
  };


logger.success('Starting Generator Jobs')
  // Start the initial cron job
  await startCronVanity(`*/${config_current.vanityinterval} * * * *`);
  await startCronWeather(`*/${config_current.weatherinterval} * * * *`);
  await startCronNews(`*/${config_current.newsinterval} * * * *`);
  await startCronOffline(`*/${config_current.offlineinterval} * * * *`);
  await startCronmerge(`*/${config_current.xmltvmergeinterval} * * * *`);
};

module.exports = {
  GENERATION
};
