const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');
const { WEATHER } = require("../generators/weather.generator");
const { NEWS } = require("../generators/news.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { CHANNEL_LOGO } = require("../generators/channel-logo.generator");
const { VANITYCARDS } = require("../generators/vanitycards.generator");
const CronJobManager = require('cron-job-manager');
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");

const GENERATION = async () => {
  const config_current = await retrieveCurrentConfiguration();

  const manager = new CronJobManager();

  let vanityRunning = false;
  let weatherRunning = false;
  let newsRunning = false;
  let offlineRunning = false;
  let mergeRunning = false;
  let channellogoRunning = false;

  const startCronVanity = async (interval) => {
    manager.add('vanity', interval, async () => {
      logger.info(`Running Vanity Cards generation at ${new Date()}`);

      while (weatherRunning || newsRunning || offlineRunning || mergeRunning || channellogoRunning) {
        const runningGenerators = [];
        if (channellogoRunning) runningGenerators.push('Channel Logo')
        if (weatherRunning) runningGenerators.push('Weather');
        if (newsRunning) runningGenerators.push('News');
        if (offlineRunning) runningGenerators.push('Channel Offline');
        if (mergeRunning) runningGenerators.push('XMLTV Merge');
        logger.info(`Vanity waiting for other generators to finish: ${runningGenerators.join(', ')}`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      vanityRunning = true;

      if (config_current.processvanitycards === 'yes') {
        try {
          await VANITYCARDS();
        } catch (error) {
          // Handle the error encountered in VANITYCARDS()
          logger.error(`Error encountered in VANITYCARDS: ${error}`);
          vanityRunning = false; // Set running to false if an error is encountered
          return;
        }
      } else {
        logger.info('Not running vanity cards');
      }

      interval = `*/${config_current.vanityinterval} * * * *` || '*/10 * * * *';
      manager.update('vanity', interval);
      logger.success(`Vanity Cards Generation completed at ${new Date()}`);

      vanityRunning = false;
    });

    manager.start('vanity');
  };

  const startCronWeather = async (interval) => {
    manager.add('weather', interval, async () => {
      logger.info(`Running Weather generation at ${new Date()}`);

      while (vanityRunning || newsRunning || offlineRunning || mergeRunning || channellogoRunning) {
        const runningGenerators = [];
        if (channellogoRunning) runningGenerators.push('Channel Logo')
        if (vanityRunning) runningGenerators.push('Vanity Cards');
        if (newsRunning) runningGenerators.push('News');
        if (offlineRunning) runningGenerators.push('Channel Offline');
        if (mergeRunning) runningGenerators.push('XMLTV Merge');
        logger.info(`Weather waiting for other generators to finish: ${runningGenerators.join(', ')}`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      weatherRunning = true;

      if (config_current.processweather === 'yes') {
        try {
          await WEATHER();
        } catch (error) {
          // Handle the error encountered in WEATHER()
          logger.error(`Error encountered in WEATHER: ${error}`);
          weatherRunning = false; // Set running to false if an error is encountered
          return;
        }
      } else {
        logger.info('Not running WEATHER');
      }

      interval = `*/${config_current.weatherinterval} * * * *` || '*/10 * * * *';
      manager.update('weather', interval);
      logger.success(`Weather Generation completed at ${new Date()}`);

      weatherRunning = false;
    });

    manager.start('weather');
  };

  const startCronNews = async (interval) => {
    manager.add('news', interval, async () => {
      logger.info(`Running News generation at ${new Date()}`);

      while (vanityRunning || weatherRunning || offlineRunning || mergeRunning || channellogoRunning) {
        const runningGenerators = [];
        if (channellogoRunning) runningGenerators.push('Channel Logo')
        if (vanityRunning) runningGenerators.push('Vanity Cards');
        if (weatherRunning) runningGenerators.push('Weather');
        if (offlineRunning) runningGenerators.push('Channel Offline');
        if (mergeRunning) runningGenerators.push('XMLTV Merge');
        logger.info(`News waiting for other generators to finish: ${runningGenerators.join(', ')}`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      newsRunning = true;

      if (config_current.processnews === 'yes') {
        try {
          await NEWS();
        } catch (error) {
          // Handle the error encountered in NEWS()
          logger.error(`Error encountered in NEWS: ${error}`);
          newsRunning = false; // Set running to false if an error is encountered
          return;
        }
      } else {
        logger.info('Not running News');
      }

      interval = `*/${config_current.newsinterval} * * * *` || '*/30 * * * *';
      manager.update('news', interval);
      logger.success(`News Generation completed at ${new Date()}`);

      newsRunning = false;
    });

    manager.start('news');
  };

  const startCronOffline = async (interval) => {
    manager.add('offline', interval, async () => {
      logger.info(`Running Channel-Offline generation at ${new Date()}`);

      while (vanityRunning || weatherRunning || newsRunning || mergeRunning || channellogoRunning) {
        const runningGenerators = [];
        if (channellogoRunning) runningGenerators.push('Channel Logo')
        if (vanityRunning) runningGenerators.push('Vanity Cards');
        if (weatherRunning) runningGenerators.push('Weather');
        if (newsRunning) runningGenerators.push('News');
        if (mergeRunning) runningGenerators.push('XMLTV Merge');
        logger.info(`Offline waiting for other generators to finish: ${runningGenerators.join(', ')}`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      offlineRunning = true;

      if (config_current.processchanneloffline === 'yes') {
        try {
          await CHANNEL_OFFLINE();
        } catch (error) {
          // Handle the error encountered in CHANNEL_OFFLINE()
          logger.error(`Error encountered in CHANNEL_OFFLINE: ${error}`);
          offlineRunning = false;
          return;
        }
      } else {
        logger.info('Not running Channel Offline');
      }

      interval = `*/${config_current.offlineinterval} * * * *` || '*/5 * * * *';
      manager.update('offline', interval);
      logger.success(`Channel-Offline Generation completed at ${new Date()}`);

      offlineRunning = false;
    });

    manager.start('offline');
  };

  const startCronmerge = async (interval) => {
    manager.add('merge', interval, async () => {
      logger.info(`Running XMLTV Merge generation at ${new Date()}`);

      while (vanityRunning || weatherRunning || newsRunning || offlineRunning || channellogoRunning) {
        const runningGenerators = [];
        if (channellogoRunning) runningGenerators.push('Channel Logo')
        if (vanityRunning) runningGenerators.push('Vanity Cards');
        if (weatherRunning) runningGenerators.push('Weather');
        if (newsRunning) runningGenerators.push('News');
        if (offlineRunning) runningGenerators.push('Channel Offline');
        logger.info(`Merge waiting for other generators to finish: ${runningGenerators.join(', ')}`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      mergeRunning = true;

      if (config_current.processxmltvmerger === 'yes') {
        if (typeof config_current.epgfiles === 'undefined' || config_current.epgfiles === '' || config_current.epgfiles === 'null') {
          try {
            await XMLTVPARSE();
          } catch (error) {
            // Handle the error encountered in XMLTVMERGE()
            logger.error(`Error encountered in XMLTVMERGE: ${error}`);
            mergeRunning = false; // Set running to false if an error is encountered
            return;
          }
        } else {
          logger.info('Not running XMLTV Merge');
        }
      }

      interval = `*/${config_current.xmltvmergeinterval} * * * *` || '*/20 * * * *';
      manager.update('merge', interval);
      logger.success(`XMLTV Merge Generation completed at ${new Date()}`);

      mergeRunning = false;
    });

    manager.start('merge');
  };


  const startCronchannellogo = async (interval) => {
    manager.add('channellogo', interval, async () => {
      logger.info(`Running Channel Logo generation at ${new Date()}`);

      while (vanityRunning || weatherRunning || newsRunning || offlineRunning || mergeRunning) {
        const runningGenerators = [];
        if (vanityRunning) runningGenerators.push('Vanity Cards');
        if (weatherRunning) runningGenerators.push('Weather');
        if (newsRunning) runningGenerators.push('News');
        if (offlineRunning) runningGenerators.push('Channel Offline');
        if (mergeRunning) runningGenerators.push('XMLTV Merge');
        logger.info(`Channel Logo waiting for other generators to finish: ${runningGenerators.join(', ')}`);
        await new Promise((resolve) => setTimeout(resolve, 15000));
      }
      channellogoRunning = true;

      if (config_current.processchannellogo === 'yes') {
          try {
            await XMLTVPARSE();
          } catch (error) {
            // Handle the error encountered in XMLTVMERGE()
            logger.error(`Error encountered in XMLTVMERGE: ${error}`);
            channellogoRunning = false; // Set running to false if an error is encountered
            return;
          }
      }

      interval = `*/${config_current.channellogointerval} * * * *` || '*/20 * * * *';
      manager.update('channellogo', interval);
      logger.success(`Channel Logo Generation completed at ${new Date()}`);

      channellogoRunning = false;
    });

    manager.start('channellogo');
  };

  logger.success('Starting Generator Jobs');

  await startCronVanity(`*/${config_current.vanityinterval} * * * *`);
  await startCronWeather(`*/${config_current.weatherinterval} * * * *`);
  await startCronNews(`*/${config_current.newsinterval} * * * *`);
  await startCronOffline(`*/${config_current.offlineinterval} * * * *`);
  await startCronmerge(`*/${config_current.xmltvmergeinterval} * * * *`);
  await startCronchannellogo(`*/${config_current.channellogointerval} * * * *`);
};

module.exports = {
  GENERATION
};
