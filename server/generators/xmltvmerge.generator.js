const fs = require('fs');
const parser = require('epg-parser');
const { XMLTVMERGEDIR } = require("../constants/path.constants");
const { create, node } = require('xmlbuilder2');
const builder = require('xmlbuilder');
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const path = require('path');

// Future todo. add option to add episode number/episode title to main description for clients without support

let isFunctionRunning = false;

const XMLTVPARSE = async () => {
  if (isFunctionRunning) {
    logger.warn('XMLTV Merger is already running.');
    return;
  }
  isFunctionRunning = true;
  createDirectoryIfNotExists(XMLTVMERGEDIR);

  const config_current = await retrieveCurrentConfiguration();
  const epgFiles = config_current.epgfiles.split(" "); // Split the space-separated string

  const epgPromises = epgFiles.map(async (epgFile, index) => {
    const trimmedEpgFile = epgFile.trim(); // Trim any extra whitespace

    let epgData;

    if (trimmedEpgFile.startsWith("http")) {
      await downloadImage(trimmedEpgFile, `${path.join(XMLTVMERGEDIR, 'epg')}${index + 1}.xml`)
        .then(logger.success)
        .catch(logger.error);

      epgData = await fs.readFileSync(`${path.join(XMLTVMERGEDIR, 'epg')}${index + 1}.xml`, { encoding: 'utf-8' });
    } else {
      epgData = await fs.readFileSync(trimmedEpgFile, { encoding: 'utf-8' });
    }

    return parser.parse(epgData);
  });

  const epgObjects = await Promise.all(epgPromises);

  const mergedObject = epgObjects.reduce((accumulator, epgObject) => {
    accumulator.channels.push(...epgObject.channels);
    accumulator.programs.push(...epgObject.programs);
    return accumulator;
  });

  const xml = builder.create('tv', { version: '1.0', encoding: 'UTF-8' });

  mergedObject.channels.forEach(channel => {
    const channelElem = xml.ele('channel', { id: channel.id });
    channel.displayName.forEach(name => channelElem.ele('display-name', name.value));
    channel.icon.forEach(icon => {
    // Check if 'src' property exists in the icon object
    if ('src' in icon) {
      channelElem.ele('icon', { src: icon.src });
      console.log(icon.src);
    } else {
      console.error("The 'icon' object does not have a 'src' property.");
    }
  });
  });

  mergedObject.programs.forEach(program => {
    const programElem = xml.ele('programme', {
      start: program.start,
      stop: program.stop,
      channel: program.channel
    });

    program.title.forEach(title => programElem.ele('title', title.value));
    program.desc.forEach(desc => programElem.ele('desc', desc.value));
    program.category.forEach(category => programElem.ele('category', category.value));

    program.episodeNum.forEach(episodeNum => {
      programElem.ele('episode-num', { system: episodeNum.system }, episodeNum.value);
    });

    program.icon.forEach(icon => {
    // Check if 'src' property exists in the icon object
    if ('src' in icon) {
      programElem.ele('icon', { src: icon.src });
      console.log(icon.src);
    } else {
      console.error("The 'icon' object does not have a 'src' property.");
    }
  });
  });

  const xmlString = xml.end({ pretty: true });
  console.log(xmlString)
  createDirectoryIfNotExists(config_current.output);
  fs.writeFileSync(`${path.join(config_current.output, 'mergedxmltv.xml')}`, xmlString, 'utf8');

  logger.success('XMLTV file created successfully.');
  isFunctionRunning = false;
};

module.exports = {
  XMLTVPARSE
};
