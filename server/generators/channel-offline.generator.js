// TODO: Fix issue when there are no programmes on a channel which will crash the app



const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR, FFMPEGCOMMAND } = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const {themecolourdecoder, retrieveCurrentTheme} = require("../utils/themes.utils");
const path = require('path');
const { listFilesInDir } = require("../utils/file.utils");
const http = require('http')

const CHANNEL_OFFLINE = async () => {
  const config_current = await retrieveCurrentConfiguration();
  const audioFile = await selectRandomAudioFile(config_current.customaudio);
  const current_theme = await retrieveCurrentTheme();
  console.log(`current theme is: ${current_theme.ErsatzTVFillerTheme.ThemeName}`);







async function downloadXmltv(xmltvFilePath) {
  return new Promise((resolve, reject) => {
    http.get(xmltvFilePath, (response) => {
      let data = '';

      // Concatenate the received data
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Resolve the promise with the complete data when the request is finished
      response.on('end', () => {
        resolve(data);
        console.log(data)
        fs.writeFileSync(`workdir/Channel-offline/xmltv.xmltv`, data);
      });
    }).on('error', (error) => {
      // Reject the promise if an error occurs
      reject(error);
    });
  });
}
  // Function to split XMLTV by channel
  const splitXMLTVByChannel = async () => {
    console.log('1')
    const xmlData = await fs.promises.readFile(`workdir/Channel-offline/xmltv.xmltv`, 'utf8')
console.log('2')
        xml2js.parseString(xmlData, (parseErr, result) => {
          if (parseErr) {
            logger.error('Error parsing XML:', parseErr);
            reject(parseErr);
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
console.log('3')
            const channelFilePath = `${WORKDIR}/Channel-offline/${channelId}.xml`;
            console.log(channelFilePath)
            await fs.promises.writeFile(channelFilePath, channelXMLString);
            console.log('3.5')
            logger.info(`Channel file saved: ${channelFilePath}`);
            console.log('4')
          });
        });
  };

  // Function to find start time
  const startTimefind = async (eachxmltvfile) => {
    console.log('5')
    console.log(eachxmltvfile)
    // Read the XML file
  const data = await fs.promises.readFile(`${eachxmltvfile}.xml`, 'utf-8')

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          logger.error('Error parsing XML:', parseErr);
          return;
        }


        // Extract the show start time
        const showName = 'Channel-Offline'; // Replace with the name of the show you're looking for
        console.log('123')

        const programme = result.tv.programme.find(program => program.title[0]._ === showName);

console.log(programme)
console.log('456')

          let nextShowName = '';
          let nextStartTime = '';
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
formattedHours = formattedHours !== NaN ? (formattedHours % 12) || 12 : '';

// Create the formatted time string
const nextShowStartTime = formattedHours && minutes ? `${formattedHours}:${minutes} ${formattedHours >= 12 ? 'PM' : 'AM'}` : '';



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
          const titlecolor = themecolourdecoder(`${current_theme.Offline.offlinetitlecolour}`);
      // const titlecolor = themecolourdecoder('FFBF00');
          const descriptioncolor = themecolourdecoder(`${current_theme.Offline.offlinetextcolour}`);
          const offlinebackgroundcolour = themecolourdecoder(`${current_theme.Offline.offlinebackgroundcolour}`);
          console.log(titlecolor)
          console.log(descriptioncolor)

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
console.log(assText)
          fs.writeFileSync(`${eachxmltvfile}.ass`, assText);

          const command = `${FFMPEGCOMMAND} -y -f lavfi -i color=${offlinebackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -vf "ass=${eachxmltvfile}.ass" -c:a copy -t 5 ${eachxmltvfile}.mp4`;

          logger.info(command);
          logger.ffmpeg(`command is ${command}`);

          exec(command, (error, stdout, stderr) => {
            if (error) {
              logger.error(`Error: ${error.message}`);
              logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
              return;
            }
            if (stderr) {
              logger.ffmpeg(`stderr: ${stderr}`);
              return;
            }
          });
      });
  };

  const runnersT = async () => {


      const folderPath = 'workdir/Channel-offline'; // Replace with the actual folder path
      let fileList = await listFilesInDir(folderPath)

      logger.info(fileList);

      for (const file of fileList) {
          if (path.extname(file) === '.xml') {
            console.log(file);
            const filename = `${file}`;
const filePath = filename.replace(/\.xml$/, "");

            console.log(filePath);
            await startTimefind(filePath);
          }
        }
        console.log('complete generation of channel-offline filler')
      }

  // Usage
  await downloadXmltv(`${config_current.xmltv}`);
  await splitXMLTVByChannel();
  await runnersT();
};

module.exports = {
  CHANNEL_OFFLINE
};
