const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR, FFMPEGCOMMAND, PROVIDER_LOGODIR } = require("../constants/path.constants");
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
const { createDirectoryIfNotExists, getImageWidthHeight } = require("../utils/file.utils");
const { downloadImage } = require("../utils/downloadimage.utils");
const { asssubstitution } = require("../utils/string.utils");
const { imageconvert } = require("../utils/imageconversion.utils");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let isFunctionRunning = false;
const PROVIDER_LOGO = async () => {
    let fileimageExtension;
  logger.info(`Provider LOGO DIR is: ${PROVIDER_LOGODIR}`)
  if (isFunctionRunning) {
  logger.warn('Provider Logo Generator is already running.');
    return;
  }
  isFunctionRunning = true;
  createDirectoryIfNotExists(PROVIDER_LOGODIR);
  const config_current = await retrieveCurrentConfiguration();
  config_current.customproviderlogo = '';

  let hwaccel, hwacceldevice;
  if (config_current.hwaccel == "") {
    hwaccel = ` `;
    logger.debug('Hwaccell: no hwaccel'); // Use the constant as needed
  } else {
    hwaccel = ` -hwaccel ${config_current.hwaccel} `;
    logger.debug(`Hwaccell: ${hwaccel}`);
  }

  if (config_current.hwaccel_device == "") {
    hwacceldevice = ``;
    logger.debug('Hwaccell_device: no hwacceldevice'); // Use the constant as needed
  } else {
    hwacceldevice = `-hwaccel_device ${config_current.hwaccel_device} `;
    logger.debug(`Hwaccell_device: ${hwacceldevice}`);
  }

  const weatherbackgroundcolour = 'red'

const downloadimages = async () => {
  await downloadImage('https://ersatztv.org/images/ersatztv.png', `${path.join(PROVIDER_LOGODIR, 'etv.png')}`)
    .then(logger.success)
    .catch(logger.error);

  await downloadImage('https://liam8888999.github.io/ErsatzTV-Filler/images/ersatztv-filler.png', `${path.join(PROVIDER_LOGODIR, 'etv-filler.png')}`)
    .then(logger.success)
    .catch(logger.error);

  if (config_current.customproviderlogo.length > 0) {
    fileimageExtension = config_current.customproviderlogo.slice(lastIndex + 1);
    await downloadImage(config_current.customproviderlogo, `${path.join(PROVIDER_LOGODIR, 'custom')}.${fileimageExtension}`)
      .then(logger.success)
      .catch(logger.error);
  }
}

const resizeimages = async () => {
  const etvimage = `${path.join(PROVIDER_LOGODIR, `etv.png`)}`
  const etvfillerimage = `${path.join(PROVIDER_LOGODIR, `etv-filler.png`)}`
  const resolution = `${config_current.videoresolution}`
  const [width, height] = resolution.split('x');
  const imgwidth = width / 4
  const imgheight = height / 4

  await imageconvert(etvimage, imgwidth, imgheight, PROVIDER_LOGODIR)
  await imageconvert(etvfillerimage, imgwidth, imgheight, PROVIDER_LOGODIR)

  if (config_current.customproviderlogo.length > 0) {
    fileimageExtension = config_current.customproviderlogo.slice(lastIndex + 1);
    await imageconvert(customimage, imgwidth, imgheight, PROVIDER_LOGODIR)
  }
}


const weathercalculations = async () => {
  const weathervideofadeoutstart = config_current.weatherduration - config_current.weathervideofadeoutduration;
  logger.debug(`Weather video fade out start: ${weathervideofadeoutstart}`)
  const weatheraudiofadeoutstart = config_current.weatherduration - config_current.weatheraudiofadeoutduration;
  logger.debug(`Weather Audio Fade out start: ${weatheraudiofadeoutstart}`)
  const weatherv4videolength = config_current.weatherduration * 3;
  const weathervideofadeoutstartv4 = weatherv4videolength - config_current.weathervideofadeoutduration;
  const weatheraudiofadeoutstartv4 = weatherv4videolength - config_current.weatheraudiofadeoutduration;
  return {
    weathervideofadeoutstart,
    weatheraudiofadeoutstart,
    weatherv4videolength,
    weathervideofadeoutstartv4,
    weatheraudiofadeoutstartv4
  };
};

const weatherCalculationsResult = await weathercalculations();

const createvideos = async (image, fileName, backgroundcolour) => {
    try {
      logger.debug(`Weather Video fade out start: ${weatherCalculationsResult.weathervideofadeoutstart}`)
      const audioFile = await selectRandomAudioFile(config_current.customaudio);
      let calcHW = getImageWidthHeight(image, config_current.videoresolution);
        //add theme information
      //part1
      const commandPart1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -i "${image}" -filter_complex "[1]scale=${calcHW.vWidth}/2:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -stream_loop -1 -i "${audioFile}" -shortest -c:a copy -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -t ${config_current.weatherduration} "${path.join(PROVIDER_LOGODIR, fileName)}"`;
      logger.ffmpeg(`ffmpeg weather commandPart1 is ${commandPart1} for ${fileName}`);

      exec(commandPart1, (error, stdout, stderr) => {
        if (error) {
          logger.error(error);

          logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
          const commandOnError1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -vf "ass='${assfile}'" -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.weatherduration} "${path.join(config_current.output, fileName)}"`;
          logger.ffmpeg(`Running weather fallback command on error: ${commandOnError1}`);
          exec(commandOnError1, (error2, stdout2, stderr2) => {
            if (error2) {
              logger.error(`Error running weather fallback command: ${error2.message}`);
              // Handle the error for the second command as needed.
            } else {
              logger.success('Weather fallback FFmpeg command executed successfully.');
            }
          });
          return;
        }
        if (stderr) {
          logger.ffmpeg(`stderr: ${stderr}`);
        }
        logger.success(`Weather part 1 created successfully for ${fileName}.`);

        //part2
        let fadeAudio;
            fadeAudio = `-af "afade=t=in:st=0:d=${config_current.weatheraudiofadeinduration},afade=t=out:st=${weatherCalculationsResult.weatheraudiofadeoutstart}:d=${config_current.weatheraudiofadeoutduration}"`;
        const commandPart2 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i "${path.join(PROVIDER_LOGODIR, fileName)}" -vf "fade=t=in:st=0:d=${config_current.weathervideofadeinduration},fade=t=out:st=${weatherCalculationsResult.weathervideofadeoutstart}:d=${config_current.weathervideofadeoutduration}" ${fadeAudio} -c:v ${config_current.ffmpegencoder} "${path.join(config_current.output, fileName)}"`;
        logger.ffmpeg(`ffmpeg weather commandPart2 is ${commandPart2} for ${fileName}`);
        exec(commandPart2, (error, stdout, stderr) => {
          if (error) {
            logger.error(error);
            logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
            return;
          }
          if (stderr) {
            logger.ffmpeg(`stderr: ${stderr}`);
          }
          logger.success(`Weather part 2 created successfully. for ${fileName}`);
        });
      });
    } catch (err) {
      logger.error(err);
    }
  };

  await downloadimages()
  await resizeimages()
  await createvideos(path.join(PROVIDER_LOGODIR, 'jimpimgdir', 'etv.png'), 'etv_provider_logo.mp4', 'black');
  await createvideos(path.join(PROVIDER_LOGODIR, 'jimpimgdir', 'etv-filler.png'), 'etv-filler_provider_logo.mp4', 'black');
  if (config_current.customproviderlogo.length > 0) {
    await createvideos(path.join(PROVIDER_LOGODIR, 'jimpimgdir', 'custom.png'), 'custom_provider_logo.mp4' , newsbackgroundcolour);
  }
  isFunctionRunning = false;
};

module.exports = {
  PROVIDER_LOGO
};
