const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR, FFMPEGCOMMAND, CHANNEL_LOGODIR } = require("../constants/path.constants");
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
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let isFunctionRunning = false;
const CHANNEL_LOGO = async () => {
    let fileimageExtension;
  logger.info(`Channel LOGO DIR is: ${CHANNEL_LOGODIR}`)
  if (isFunctionRunning) {
  logger.error('Channel Logo Generator is already running.');
    return;
  }
  isFunctionRunning = true;
  createDirectoryIfNotExists(CHANNEL_LOGODIR);
  const config_current = await retrieveCurrentConfiguration();

  // Function to split XMLTV by channel
  // Moved to XMLTV.utils

  // Function to find start time
  const startTimefind = async (eachxmltvfile) => {

    const audioFile = await selectRandomAudioFile(config_current.customaudio);
    const current_theme = await retrieveCurrentTheme();
    logger.info(`eachxmltvfile: ${eachxmltvfile}`);
    try {
      // Read the XML file
      const data = await fs.promises.readFile(`${path.join(CHANNEL_LOGODIR, eachxmltvfile)}.xml`, 'utf-8');

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          logger.error(`Error parsing XML: ${parseErr}`);
          return;
        }

        const channels = result.tv.channel;
      channels.forEach((channel) => {
        const channelId = channel.$.id;
        const channelLogo = channel.icon && channel.icon[0].$.src;

        const filename = `${channelLogo}`
        const lastIndex = filename.lastIndexOf(".");
        if (lastIndex !== -1) {
          fileimageExtension = filename.slice(lastIndex + 1);
        } else {
          logger.error("No file extension found.");
        }
        downloadImage(`${channelLogo}`, `${path.join(CHANNEL_LOGODIR, eachxmltvfile)}.${fileimageExtension}`)
    .then(() => {
      logger.success
      const convertimage = `${path.join(CHANNEL_LOGODIR, eachxmltvfile)}.${fileimageExtension}`
      const resolution = `${config_current.videoresolution}`
      const [width, height] = resolution.split('x');
      const imgwidth = width / 4
      const imgheight = height / 4
            imageconvert(convertimage, imgwidth, imgheight, CHANNEL_LOGODIR)
            .then(async() => {
            //  await delay(4000)
      const channellogovideofadeoutstart = config_current.channellogoduration - config_current.channellogovideofadeoutduration;
      const channellogoaudiofadeoutstart = config_current.channellogoduration - config_current.channellogoaudiofadeoutduration;



            if (config_current.hwaccel == "") {
              hwaccel = ` `;
              logger.info('Hwaccell: no hwaccel'); // Use the constant as needed
            } else {
              hwaccel = ` -hwaccel ${config_current.hwaccel} `;
              logger.info(`Hwaccell: ${hwaccel}`);
            }

      if (config_current.hwaccel_device == "") {
        hwacceldevice = ``;
        logger.info('Hwaccel_device: no hwacceldevice'); // Use the constant as needed
      } else {
        hwacceldevice = `-hwaccel_device ${config_current.hwaccel_device} `;
        logger.info(`Hwaccel_device: ${hwacceldevice}`);
      }
        const backgroundcolour = current_theme.ChannelLogo.channellogobackgroundcolour;

          //add theme information
          //part1
            const commandv1part1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -i "${path.join(CHANNEL_LOGODIR, 'jimpimgdir', eachxmltvfile)}.png" -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[1]scale=iw*2:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -c:a copy -t ${config_current.channellogoduration} ${path.join(CHANNEL_LOGODIR, `${eachxmltvfile}-logo-working.mp4`)}`;
            logger.ffmpeg(`ffmpeg channel-logo commandv1 is ${commandv1part1}`);
          exec(commandv1part1, (error, stdout, stderr) => {
            if (error) {
              logger.error(`Error: ${error.message}`);

              logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
              // Run another FFmpeg command here on error
              const commandOnError3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=text='Unfortunately the channel-logo filler is unavailable at this time, Hopefully it will be back soon':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.channellogoduration} ${path.join(config_current.output, `${eachxmltvfile}-logo.mp4`)}`;
              logger.ffmpeg(`Running channel-logo fallback command on error: ${commandOnError3}`);
              exec(commandOnError3, (error3, stdout3, stderr3) => {
              if (error3) {
              logger.error(`Error running channel-logo fallback command: ${error3.message}`);
              // Handle the error for the second command as needed.
              } else {
              logger.success('channel-logo fallback FFmpeg command executed successfully.');
              }
              });
              return;
            }
            if (stderr) {
              logger.ffmpeg(`stderr: ${stderr}`);
           }
            logger.success('channel-logo v1 part 1 created successfully.');

            //part2
            const commandv1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i ${path.join(CHANNEL_LOGODIR, `${eachxmltvfile}-logo-working.mp4`)} -vf "fade=t=in:st=0:d=${config_current.channellogovideofadeinduration},fade=t=out:st=${channellogovideofadeoutstart}:d=${config_current.channellogovideofadeoutduration}" -af "afade=t=in:st=0:d=${config_current.channellogoaudiofadeinduration},afade=t=out:st=${channellogoaudiofadeoutstart}:d=${config_current.channellogoaudiofadeoutduration}" -c:v ${config_current.ffmpegencoder} ${path.join(config_current.output, `${eachxmltvfile}-logo.mp4`)}`;
          logger.ffmpeg(`ffmpeg channel-logo commandv1 is ${commandv1}`);
            exec(commandv1, (error, stdout, stderr) => {
              if (error) {
                logger.error(`Error: ${error.message}`);

                logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
                return;
              }
              if (stderr) {
                logger.ffmpeg(`stderr: ${stderr}`);
              }
              logger.success('channel-logo v1 created successfully.');
            });
          });

});

});
      });

      });
    } catch (error) {
      logger.error(`Error reading XML file: ${error}`);
    }
  };


  const runnersT = async () => {
    let fileList = await listFilesInDir(CHANNEL_LOGODIR);


    logger.info(`Channel-logo File List: ${fileList}`);

    async function processFilesSequentially() {
      for (const file of fileList) {
        if (path.extname(file) === '.xml') {
          logger.info(`channel-logo file: ${file}`);
          const filename = `${file}`;
          logger.info(`channel-logo filename: ${filename}`);

          // Use path.sep to get the correct path separator for the platform
          const lastIndex = filename.lastIndexOf(path.sep);
          const filenamenopath = filename.substring(lastIndex + 1);
          const filePath = filenamenopath.replace(/\.xml$/, "").replace(CHANNEL_LOGODIR, "");

          logger.info(`file path is ${filePath}`);
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
    logger.success('complete generation of channel-logo filler');
  };

  try {

    await splitXMLTVByChannel(CHANNEL_LOGODIR);
    await createDirectoryIfNotExists(config_current.output);
    await runnersT();
  } catch (error) {
    // Handle the connection error
    logger.error(`Error downloading or processing XMLTV: ${error}`);
    // Stop further execution by throwing the error
    isFunctionRunning = false;
    throw error
  }
  isFunctionRunning = false;
};

module.exports = {
  CHANNEL_LOGO
};
