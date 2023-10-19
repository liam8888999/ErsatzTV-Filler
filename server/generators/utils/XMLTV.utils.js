const logger = require("../../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../../modules/config-loader.module");
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const { downloadImage } = require("../../utils/downloadimage.utils");

const splitXMLTVByChannel = async (xmltvpath) => {
  const config_current = await retrieveCurrentConfiguration();
  await downloadImage(`${config_current.ersatztv}/iptv/xmltv.xml`, `${path.join(xmltvpath, 'xmltv.xmltv')}`)
  .then(logger.success)
  .catch(logger.error);
  const xmlData = await fs.promises.readFile(`${path.join(xmltvpath, 'xmltv.xmltv')}`, 'utf8');
  xml2js.parseString(xmlData, (parseErr, result) => {
    if (parseErr) {
      logger.error(`Error parsing XML: ${parseErr}`);
      return;
    }

    const channels = result.tv.channel;

    channels.forEach(async (channel) => {
      const channelId = channel.$.id;

      const programs = result.tv.programme.filter(program => program.$.channel === channelId);

      const builder = new xml2js.Builder();

      const channelXMLData = {
        tv: {
          channel: [channel],
          programme: programs
        }
      };

      const channelXMLString = builder.buildObject(channelXMLData);
      const channelFilePath = `${path.join(xmltvpath, channelId)}.xml`;
      logger.info(`ChannelFilePath: ${channelFilePath}`);
      await fs.promises.writeFile(channelFilePath, channelXMLString);
      logger.success(`Channel file saved: ${channelFilePath}`);
    });
  });
};



module.exports = {
splitXMLTVByChannel
};
