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
        console.error('Error reading XMLTV file:', err);
        callback(err);
        return;
      }

      xml2js.parseString(xmlData, (parseErr, result) => {
        if (parseErr) {
          console.error('Error parsing XML:', parseErr);
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

          const channelFilePath = `${WORKDIR}/${channelId}.xml`;
          fs.writeFile(channelFilePath, channelXMLString, 'utf8', writeErr => {
            if (writeErr) {
              console.error(`Error writing channel file (${channelFilePath}):`, writeErr);
              return;
            }
            console.log(`Channel file saved: ${channelFilePath}`);
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
    fs.readFile('workdir/417930auepg.com.au.xml', 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading XML file:', err);
        return;
      }

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          console.error('Error parsing XML:', parseErr);
          return;
        }

        // Extract the show start time
        const showName = 'Vietnamese'; // Replace with the name of the show you're looking for

        const programme = result.tv.programme.find(program => program.title[0] === showName);

        if (programme) {
          const showstartTimeString = programme.$.start;
          const year = showstartTimeString.substring(0, 4);
          const month = showstartTimeString.substring(4, 6);
          const day = showstartTimeString.substring(6, 8);
          const hours24 = showstartTimeString.substring(8, 10);
          const minutes = showstartTimeString.substring(10, 12);
          const seconds = showstartTimeString.substring(12, 14);

          let hours12 = parseInt(hours24);
          let ampm = 'AM';

          if (hours12 >= 12) {
            hours12 = hours12 % 12;
            ampm = 'PM';
          }

          if (hours12 === 0) {
            hours12 = 12;
          }

          const showstartTime = new Date(`${year}-${month}-${day}T${hours12.toString().padStart(2, '0')}:${minutes}:${seconds}`);
          const formattedTime = showstartTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

          console.log('Start time:', formattedTime);



          let nextShowName = null;

          const index = result.tv.programme.findIndex(program => program.title[0] === showName);
          if (index !== -1 && index < result.tv.programme.length - 1) {
            nextShowName = result.tv.programme[index + 1].title[0];
          }

          console.log(nextShowName);




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

          const newsFeed = `{\\r}{\\b1}{\\c&H${titlecolor}&}This Channel is Currently offline\n\n{\\r}{\\b0}{\\c&H${descriptioncolor}&}Next showing at: ${formattedTime}\n\nStarting With: ${nextShowName}`;
          const lines = newsFeed.replace(/\n/g, '\\N');
      //    let lines = newsFeed;
          console.log(lines)

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
        } else {
          console.log('Show not found in the schedule.');
        }
      });
    });
  };

  // Usage
  const xmltvFilePath = `${WORKDIR}/epg2.xml`;
  splitXMLTVByChannel(xmltvFilePath, () => {
    startTimefind(); // Call the startTimefind function after splitting the XMLTV file
  });
};

module.exports = {
  CHANNEL_OFFLINE
};
