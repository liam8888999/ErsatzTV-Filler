const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR, FFMPEGCOMMAND } = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");

const CHANNEL_OFFLINE = async () => {
  const config_current = await retrieveCurrentConfiguration();
  const audioFile = await selectRandomAudioFile(config_current.customaudio);

  // Function to split XMLTV by channel
  function splitXMLTVByChannel(xmltvFilePath, callback) {
    fs.readFile(xmltvFilePath, 'utf8', (err, xmlData) => {
      if (err) {
        logger.error('Error reading XMLTV file:', err);
        callback(err);
        return;
      }

      xml2js.parseString(xmlData, (parseErr, result) => {
        if (parseErr) {
          logger.error('Error parsing XML:', parseErr);
          callback(parseErr);
          return;
        }

        const channels = result.tv.channel;

        channels.forEach(channel => {
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
          fs.writeFile(channelFilePath, channelXMLString, 'utf8', writeErr => {
            if (writeErr) {
              logger.error(`Error writing channel file (${channelFilePath}):`, writeErr);
              return;
            }
            logger.info(`Channel file saved: ${channelFilePath}`);
          });

          // Check if this is the last channel
          if (channel === channels[channels.length - 1]) {
            // Invoke the callback once the last channel is processed
            callback();
          }
        });
      });
    });
  }

  // Function to find start time
  const startTimefind = async () => {
    // Read the XML file
    fs.readFile('workdir/Channel-offline/968.1.etv.xml', 'utf-8', (err, data) => {
      if (err) {
        logger.error('Error reading XML file:', err);
        return;
      }

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          logger.error('Error parsing XML:', parseErr);
          return;
        }


        // Extract the show start time
        const showName = 'Channel-Offline'; // Replace with the name of the show you're looking for

        const programme = result.tv.programme.find(program => program.title[0]._ === showName);



          let nextShowName = null;
          let nextStartTime = null;
const index = result.tv.programme.findIndex(program => program.title[0]._ === showName);

if (index !== -1 && index < result.tv.programme.length - 1) {
  for (let i = index + 1; i < result.tv.programme.length; i++) {
    const nextProgramme = result.tv.programme[i];
    nextShowName = nextProgramme.title[0]._;

    nextStartTime = nextProgramme.$.start;

    if (nextShowName !== showName) {
      break;
    }
  }
}
logger.info(nextStartTime)
// Extract the time portion from the nextStartTime string
const time = nextStartTime.substr(8, 6);

// Extract hours, minutes, and seconds from the time string
const hours = time.substr(0, 2);
const minutes = time.substr(2, 2);
const seconds = time.substr(4, 2);

// Convert hours to 12-hour format
let formattedHours = parseInt(hours);
formattedHours = (formattedHours % 12) || 12;

// Create the formatted time string
const nextShowStartTime = `${formattedHours}:${minutes} ${formattedHours >= 12 ? 'PM' : 'AM'}`;


logger.info(nextShowStartTime)

          // Calculate the duration for each subtitle
          const subtitleDuration = 0; // Duration in seconds

          // Calculate the start and end time for each subtitle
          let startTime = 0; // Start time adjusted by 2 seconds
          let endTime = 5;

          // Define the font size and line spacing
          const fontSize = 32;
          const lineSpacing = 1;

          // Calculate the total height of the subtitle
        //  const subtitleHeight = 1 * fontSize * lineSpacing + 80;
        //  logger.info(subtitleHeight);


          // Create the move effect string
          const moveEffect = ''//`{\\move(0,0,0,0)}`;

          const titlecolor = 'FF0000'
          const descriptioncolor = 'FF0000'

          const newsFeed = `{\\r}{\\b1}{\\c&H${titlecolor}&}This Channel is Currently offline\n\n{\\r}{\\b0}{\\c&H${descriptioncolor}&}Next showing at: ${nextShowStartTime}\n\nStarting With: ${nextShowName}`;
          const lines = newsFeed.replace(/\n/g, '\\N');
      //    let lines = newsFeed;
          logger.info(lines)

          // Combine the move effect with the subtitle text
          const subtitle = `${moveEffect}${lines}`;

          const resolution = `${config_current.videoresolution}`

          const [width, height] = resolution.split('x');

          const centering = `${height}/2`;

          let assText = `[Script Info]
          Title: Scrolling Text Example
          ScriptType: v4.00+
          WrapStyle: 0
          PlayResX: ${width}
          PlayResY: ${height}

          [V4+ Styles]
          Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
          Style: Default, Arial, 32, &H00000000, &H00000000, &H00000000, &H00000000, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 5, 30, 30, 50, 0

            [Events]
            Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
            Dialogue: 0, 0:00:${startTime.toString().padStart(2, '0')}.00, 0:00:${endTime.toString().padStart(2, '0')}.00, Default, ScrollText, 0, 0, ${centering}, ,${subtitle}`;

          fs.writeFileSync(`${WORKDIR}/Channel-offline/offline.ass`, assText);

          const command = `${FFMPEGCOMMAND} -y -f lavfi -i color=white:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -vf "ass=${WORKDIR}/Channel-offline/offline.ass" -c:a copy -t 5 ${WORKDIR}/Channel-offline/output.mp4`;

          logger.info(command);
          logger.ffmpeg(`command is ${command}`);

          exec(command, (error, stdout, stderr) => {
            if (error) {
              logger.error(`Error: ${error.message}`);
              return;
            }
            if (stderr) {
              logger.ffmpeg(`stderr: ${stderr}`);
              return;
            }
          });
      });
    });
  };

  // Usage
  const xmltvFilePath = `${WORKDIR}/Channel-offline/xmltv.xml`;
  splitXMLTVByChannel(xmltvFilePath, () => {
    startTimefind(); // Call the startTimefind function after splitting the XMLTV file
  });
};

module.exports = {
  CHANNEL_OFFLINE
};
