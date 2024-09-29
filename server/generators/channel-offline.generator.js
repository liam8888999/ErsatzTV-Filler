const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR, FFMPEGCOMMAND, CHANNEL_OFFLINEDIR } = require("../constants/path.constants");
const logger = require("../utils/logger.utils");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const { splitXMLTVByChannel } = require("./utils/XMLTV.utils");
const {themecolourdecoder, retrieveCurrentTheme} = require("../utils/themes.utils");
const path = require('path');
const { listFilesInDir } = require("../utils/file.utils");
const http = require('http')
const https = require('https')
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const { downloadImage } = require("../utils/downloadimage.utils");
const { asssubstitution } = require("../utils/string.utils");
const { imageconvert } = require("../utils/imageconversion.utils");

let isFunctionRunning = false;
const CHANNEL_OFFLINE = async () => {
    let fileimageExtension;
  logger.info(`Channel OFFLINE DIR is: ${CHANNEL_OFFLINEDIR}`)
  if (isFunctionRunning) {
  logger.warn('Channel Offline Generator is already running.');
    return;
  }
  isFunctionRunning = true;
  createDirectoryIfNotExists(CHANNEL_OFFLINEDIR);
  const config_current = await retrieveCurrentConfiguration();

  // Function to split XMLTV by channel
  // Moved to XMLTV.utils

  // Function to find start time
  const startTimefind = async (eachxmltvfile) => {

    const audioFile = await selectRandomAudioFile(config_current.customaudio);
    const current_theme = await retrieveCurrentTheme();
    logger.debug(`eachxmltvfile: ${eachxmltvfile}`);
    try {
      // Read the XML file
      const data = await fs.promises.readFile(`${path.join(CHANNEL_OFFLINEDIR, eachxmltvfile)}.xml`, 'utf-8');

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          logger.error(`Error parsing XML: ${parseErr}`);
          return;
        }

        const channels = result.tv.channel;
      channels.forEach((channel) => {
        const channelId = channel.$.id;
        const channelLogo1 = channel.icon && channel.icon[0].$.src;
        const channelLogo = channelLogo1.split('?')[0]

        const filename = `${channelLogo}`
        const lastIndex = filename.lastIndexOf(".");
        if (lastIndex !== -1) {
          fileimageExtension = filename.slice(lastIndex + 1);
        } else {
          logger.error("No file extension found.");
        }
        downloadImage(`${channelLogo}`, `${path.join(CHANNEL_OFFLINEDIR, eachxmltvfile)}.${fileimageExtension}`)
    .then(() => {
      logger.success
const convertimage = `${path.join(CHANNEL_OFFLINEDIR, eachxmltvfile)}.${fileimageExtension}`
      imageconvert(convertimage, 200, 200, CHANNEL_OFFLINEDIR)
      .then(() => {

              // Extract the show start time
          const showName = 'Channel-Offline'; // Replace with the name of the show you're looking for

          const programme = result.tv.programme.find(program => program.title[0]._ === showName);

      logger.debug(`Next program name: ${programme}`)

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
      logger.debug(`Next show start time: ${nextStartTime}`)
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



      logger.debug(`Next Show Start time (AM/PM): ${nextShowStartTime}`)

            // Calculate the duration for each subtitle
            const subtitleDuration = 0; // Duration in seconds

            // Calculate the start and end time for each subtitle
            let startTime = 0; // Start time adjusted by 2 seconds
            let endTime = 5;

            // Define the font size and line spacing
            const fontSize = 32;
            const lineSpacing = 1;



            // Create the move effect string
            const moveEffect = ''//`{\\move(0,0,0,0)}`;
            const titlecolor = themecolourdecoder(`${current_theme.Offline.offlinetitlecolour}`);
        // const titlecolor = themecolourdecoder('FFBF00');
            const descriptioncolor = themecolourdecoder(`${current_theme.Offline.offlinetextcolour}`);
            const offlinebackgroundcolour = `${current_theme.Offline.offlinebackgroundcolour}`;
            logger.debug(`Offline Title Colour: ${titlecolor}`)
            logger.debug(`Offline Description Colour: ${descriptioncolor}`)

            const newsFeed = `{\\r}{\\b1}{\\c&H${titlecolor}&}This Channel is Currently offline\n\n{\\r}{\\b0}{\\c&H${descriptioncolor}&}Next showing at: ${nextShowStartTime}\n\nStarting With: ${nextShowName}`;
            const lines = newsFeed.replace(/\n/g, '\\N');
        //    let lines = newsFeed;
            logger.debug(`channel-offline template: ${lines}`)

            // Combine the move effect with the subtitle text
            const subtitle = `${moveEffect}${lines}`;

            const resolution = `${config_current.videoresolution}`

            const [width, height] = resolution.split('x');

            const centering = `${height}/2`;
            const assimage = `${asssubstitution(path.join(CHANNEL_OFFLINEDIR, 'jimpimgdir', eachxmltvfile))}.png`
            logger.debug (assimage)

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
      logger.debug(`Channel-offline Ass text: ${assText}`)
            fs.writeFileSync(`${path.join(CHANNEL_OFFLINEDIR, eachxmltvfile)}.ass`, assText);


            if (config_current.hwaccel == "") {
              hwaccel = ` `;
              logger.debug('Hwaccell: no hwaccel'); // Use the constant as needed
            } else {
              hwaccel = ` -hwaccel ${config_current.hwaccel} `;
              logger.debug(`Hwaccell: ${hwaccel}`);
            }

      if (config_current.hwaccel_device == "") {
        hwacceldevice = ``;
        logger.debug('Hwaccel_device: no hwacceldevice'); // Use the constant as needed
      } else {
        hwacceldevice = `-hwaccel_device ${config_current.hwaccel_device} `;
        logger.debug(`Hwaccel_device: ${hwacceldevice}`);
      }
      const assfile = asssubstitution(`${path.join(CHANNEL_OFFLINEDIR, eachxmltvfile)}.ass`)
        const command = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${offlinebackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -vf "movie='${assimage}' [image]; [in][image] overlay=(W-w)/2:(H-h)/5 [video+image]; [video+image] ass='${assfile}'" -c:v ${config_current.ffmpegencoder} -c:a copy -t 5 "${path.join(config_current.output, eachxmltvfile)}.mp4"`;

            logger.ffmpeg(`Channel-Offline ffmpeg command is ${command}`);

            exec(command, (error, stdout, stderr) => {
              if (error) {
                logger.error(`Error: ${error.message}`);
                logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
                // Run another FFmpeg command here on error
          const commandOnError3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${offlinebackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=text='Unfortunately the channel-offline filler is unavailable at this time, Hopefully it will be back soon':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t 5 "${path.join(config_current.output, eachxmltvfile)}.mp4"`;
          logger.ffmpeg(`Running channel-offline fallback command on error: ${commandOnError3}`);
          exec(commandOnError3, (error3, stdout3, stderr3) => {
            if (error3) {
              logger.error(`Error running channel-offline fallback command: ${error3.message}`);
              // Handle the error for the second command as needed.
            } else {
              logger.success('channel-offline fallback FFmpeg command executed successfully.');
            }
          });
                return;
              }
              if (stderr) {
                logger.ffmpeg(`stderr: ${stderr}`);
                return;
            }  })
            .catch(logger.error);
     });

});


      });

      });
    } catch (error) {
      logger.error(`Error reading XML file: ${error}`);
    }
  };

  const runnersT = async () => {
    let fileList = await listFilesInDir(CHANNEL_OFFLINEDIR);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    logger.debug(`Channel-Offline File List: ${fileList}`);

    async function processFilesSequentially() {
      for (const file of fileList) {
        if (path.extname(file) === '.xml') {
          logger.debug(`channel-offline file: ${file}`);
          const filename = `${file}`;
          logger.debug(`channel-offline filename: ${filename}`);

          // Use path.sep to get the correct path separator for the platform
          const lastIndex = filename.lastIndexOf(path.sep);
          const filenamenopath = filename.substring(lastIndex + 1);
          const filePath = filenamenopath.replace(/\.xml$/, "").replace(CHANNEL_OFFLINEDIR, "");

          logger.debug(`file path is ${filePath}`);
          try {
            await startTimefind(filePath);
            logger.success(`File processed successfully: ${file}`);
          } catch (error) {
            logger.error(`Error processing file: ${file}`, error);
          }

          // Introduce a delay of 5 seconds (5000 milliseconds) before processing the next file
          await delay(3000);
        }
      }
    }

    // Call the function to start processing the files sequentially
    await processFilesSequentially();
    logger.success('complete generation of channel-offline filler');
  };

  try {

    await splitXMLTVByChannel(CHANNEL_OFFLINEDIR);
    await createDirectoryIfNotExists(config_current.output);
    await runnersT();
  } catch (error) {
    // Handle the connection error
    logger.error(error);
    // Stop further execution by throwing the error
    isFunctionRunning = false;
    throw error
  }
  isFunctionRunning = false;
};

module.exports = {
  CHANNEL_OFFLINE
};
