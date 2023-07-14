const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR, FFMPEGCOMMAND, CHANNEL_OFFLINEDIR } = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const {themecolourdecoder, retrieveCurrentTheme} = require("../utils/themes.utils");
const path = require('path');
const { listFilesInDir } = require("../utils/file.utils");
const http = require('http')
const { createDirectoryIfNotExists } = require("../utils/file.utils");

let isFunctionRunning = false;
const CHANNEL_OFFLINE = async () => {
  if (isFunctionRunning) {
  logger.error('Channel Offline Generator is already running.');
    return;
  }
  isFunctionRunning = true;
  createDirectoryIfNotExists(CHANNEL_OFFLINEDIR);
  const config_current = await retrieveCurrentConfiguration();
  const audioFile = await selectRandomAudioFile(config_current.customaudio);
  const current_theme = await retrieveCurrentTheme();
  logger.info(`current theme is: ${current_theme.ErsatzTVFillerTheme.ThemeName}`);

  async function downloadXmltv(xmltvFilePath) {
    return new Promise((resolve, reject) => {
      http.get(xmltvFilePath, (response) => {
        if (response.statusCode !== 200) {
          // Reject the promise with an error
          reject(new Error(`Failed to download XMLTV. Status code: ${response.statusCode}`));
          return;
        }

        let data = '';

        // Concatenate the received data
        response.on('data', (chunk) => {
          data += chunk;
        });

        // Resolve the promise with the complete data when the request is finished
        response.on('end', () => {
          resolve(data);
          logger.info(data);
          fs.writeFileSync(`workdir/Channel-offline/xmltv.xmltv`, data);
        });
      }).on('error', (error) => {
        // Reject the promise with the error
        reject(error);
      });
    });
  }

  // Function to split XMLTV by channel
  const splitXMLTVByChannel = async () => {
    const xmlData = await fs.promises.readFile(`workdir/Channel-offline/xmltv.xmltv`, 'utf8');
    xml2js.parseString(xmlData, (parseErr, result) => {
      if (parseErr) {
        logger.error('Error parsing XML:', parseErr);
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
        const channelFilePath = `${WORKDIR}/Channel-offline/${channelId}.xml`;
        logger.info(channelFilePath);
        await fs.promises.writeFile(channelFilePath, channelXMLString);
        logger.info(`Channel file saved: ${channelFilePath}`);
      });
    });
  };

  // Function to find start time
  const startTimefind = async (eachxmltvfile) => {
    logger.info(eachxmltvfile);
    try {
      // Read the XML file
      const data = await fs.promises.readFile(`${eachxmltvfile}.xml`, 'utf-8');

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          logger.error('Error parsing XML:', parseErr);
          return;
        }

        // Rest of the code here...

      });
    } catch (error) {
      logger.error('Error reading XML file:', error);
    }
  };

  const runnersT = async () => {
    const folderPath = 'workdir/Channel-offline'; // Replace with the actual folder path
    let fileList = await listFilesInDir(folderPath);

    logger.info(fileList);

    for (const file of fileList) {
      if (path.extname(file) === '.xml') {
        logger.info(file);
        const filename = `${file}`;
        const filePath = filename.replace(/\.xml$/, "");

        logger.info(filePath);
        await startTimefind(filePath);
      }
    }
    logger.success('complete generation of channel-offline filler');
  };

  try {
    const downloadedData = await downloadXmltv('http://127.0.0.1:8409/xmltv');
    // Handle the downloaded data
    logger.success('XMLTV downloaded successfully:', downloadedData);
  } catch (error) {
    // Handle the connection error
    logger.error('Error downloading or processing XMLTV:', error);
    // Stop further execution by throwing the error
    return
  }
  await splitXMLTVByChannel();
  await runnersT();
  isFunctionRunning = false;
};

module.exports = {
  CHANNEL_OFFLINE
};
