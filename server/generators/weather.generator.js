const {selectRandomAudioFile} = require("./utils/randomaudio.utils");
const {downloadImage} = require("../utils/downloadimage.utils");
const {WEATHERDIR, FFMPEGCOMMAND, DEFAULT_WEATHER_SCRIPT} = require("../constants/path.constants");
const {retrieveCurrentConfiguration} = require("../modules/config-loader.module");
const logger = require("../utils/logger.utils");
const {createDirectoryIfNotExists, getImageWidthHeight} = require("../utils/file.utils");
const {themecolourdecoder, retrieveCurrentTheme} = require("../utils/themes.utils");
const {exec} = require("child_process");
const fs = require('fs');
const path = require('path');
const {asssubstitution} = require("../utils/string.utils");
const {contrastColor} = require('contrast-color');
const {createAudio, ffmpegSpeechOrMusicCommand, speedFactor} = require("./utils/texttospeech.utils");
const { weatherTemplateReplacement, currentTemplate} = require("./utils/weather-templating.utils");

let isFunctionRunning = false;

const WEATHER = async () => {
  if (isFunctionRunning) {
    logger.warn('Weather Generator is already running.');
    return;
  }
  isFunctionRunning = true;
  createDirectoryIfNotExists(WEATHERDIR);
  logger.info("starting weather")

  const config_current = await retrieveCurrentConfiguration();
  const current_theme = await retrieveCurrentTheme();
  const weatherbackgroundcolour = current_theme.Weather.weatherbackgroundcolour;
  const scriptAudioPath = path.join(WEATHERDIR, 'weather-script.mp3');
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

  let currentTempC;
  let currentTempF;
  let humidity;
  let weatherDescription;
  let textterror;

  // Booked image url format
  // a += '<img src="https://w.bookcdn.com/weather/picture/' + e + "_" + n + "_" + booked.weather.cmetric + "_" + booked.weather.wlangid + "_" + booked.weather.color + "_" + h + "_" + booked.weather.header_color + "_" + booked.weather.text_color + "_" + booked.weather.link_color + "_" + booked.weather.border_form + "_" + booked.weather.footer_color + "_" + booked.weather.footer_text_color + "_" + booked.weather.transparent + "_6.png


  let v1 = `https://www.weatherforyou.net/fcgi-bin/hw3/hw3.cgi?config=png&forecast=zone&alt=hwizone7day5&place=${config_current.city}&state=${config_current.state}&country=${config_current.country}&hwvbg=black&hwvtc=white&daysonly=2&maxdays=7`;
  let v2 = `https://www.weatherforyou.net/fcgi-bin/hw3/hw3.cgi?config=png&forecast=zandh&alt=hwiws&place=${config_current.city}&state=${config_current.state}&country=${config_current.country}&daysonly=0&maxdays=1`;
  let v3 = `https://www.weatherforyou.net/fcgi-bin/hw3/hw3.cgi?config=png&forecast=zandh&alt=hwizandh&place=${config_current.city}&state=${config_current.state}&country=${config_current.country}&hwvbg=black&hwvtc=white&daysonly=2&maxdays=5`;
  if (config_current.booked_code.length > 0) {
    const html = config_current.booked_code;
    const idPos = html.indexOf('cityID=');
    const semiPos = html.indexOf(';', idPos);
    if (idPos > 0 && semiPos > 0) {
      const units = config_current.temperatureunits.toLowerCase() === 'fahrenheit' ? 0 : 1;
      const city_id = html.substring(idPos + 7, semiPos);
      v1 = `https://w.bookcdn.com/weather/picture/3_${city_id}_${units}_1_137AE9_430_ffffff_333333_08488D_1_ffffff_333333_0_6.png`;
      v2 = `https://w.bookcdn.com/weather/picture/4_${city_id}_${units}_1_137AE9_350_ffffff_333333_08488D_1_ffffff_333333_0_6.png`;
      v3 = `https://w.bookcdn.com/weather/picture/1_${city_id}_${units}_1_137AE9_320_ffffff_333333_08488D_1_ffffff_333333_0_6.png`;
    }
  } else if (config_current.usewttrin === true || config_current.country.toLowerCase() !== 'us') {
    v1 = `https://wttr.in/${config_current.city}+${config_current.state}.png`;
    v2 = `https://v2.wttr.in/${config_current.city}+${config_current.state}.png`;
    v3 = `https://v3.wttr.in/${config_current.state}+${config_current.state}.png`;
  }
  const downloadimages = async () => {
    logger.info("Downloading weather images")
    logger.info(`Current City: ${config_current.city}`)
    logger.info(`Weatherdir: ${WEATHERDIR}`)

    await downloadImage(v1, `${path.join(WEATHERDIR, 'v1.png')}`)
      .then(logger.success)
      .catch(logger.error);

    await downloadImage(v2, `${path.join(WEATHERDIR, 'v2.png')}`)
      .then(logger.success)
      .catch(logger.error);

    await downloadImage(v3, `${path.join(WEATHERDIR, 'v3.png')}`)
      .then(logger.success)
      .catch(logger.error);

    await downloadImage(`https://wttr.in/${config_current.city}+${config_current.state}?format=j1`, `${path.join(WEATHERDIR, 'weather.json')}`)
      .then(logger.success)
      .catch(logger.error);
    if (config_current.readweather) {
      await downloadImage(`https://wttr.in/${config_current.city}+${config_current.state}?format=j2`, `${path.join(WEATHERDIR, 'weather2.json')}`)
        .then(logger.success)
        .catch(logger.error);
    }

    await fs.promises.readFile(`${path.join(WEATHERDIR, 'weather.json')}`, 'utf8')
      .then(data => {
// Parse the JSON data into a JavaScript object
        weatherjsonObject = JSON.parse(data);

// Now you can work with the jsonObject
      })
      .catch(error => {
        logger.error('Error reading JSON file:', error);
      });
    logger.debug(weatherjsonObject);
    const currentCondition = weatherjsonObject.current_condition[0];

    currentTempC = currentCondition.temp_C;
    currentTempF = currentCondition.temp_F;
    humidity = currentCondition.humidity;
    weatherDescription = currentCondition.weatherDesc[0].value;
    logger.debug(currentTempC)
    logger.debug(currentTempF)
    logger.debug(humidity)
    logger.debug(weatherDescription)
    dateTimeString = currentCondition.localObsDateTime;

    let TEMPWITHUNIT;
    let temperatureUnit = config_current.temperatureunits?.toLowerCase();

    if (temperatureUnit) {
      const kelvintemp = parseFloat(currentTempC) + 273.15
      if (temperatureUnit === 'celsius') {
        TEMPWITHUNIT = `${currentTempC}°C`;
      } else if (temperatureUnit === 'fahrenheit') {
        TEMPWITHUNIT = `${currentTempF}°F`;
      } else if (temperatureUnit === 'kelvin') {
        TEMPWITHUNIT = `${kelvintemp}°K`;
      } else {
        // If none of the above, set a default value or handle the case accordingly
        TEMPWITHUNIT = `${currentTempC}°C or ${currentTempF}°F`;
      }
    } else {
      TEMPWITHUNIT = `${currentTempC}°C or ${currentTempF}°F`;
    }
    console.log(TEMPWITHUNIT)
    const contrasttextcolor = contrastColor({
      bgColor: `${weatherbackgroundcolour}`,
      threshold: 140
    }).replace(/#/g, '');
    const textcolor = themecolourdecoder(contrasttextcolor)
// Step 7: Prepare the ASS subtitle text
    if (config_current.showweatherheader === true) {
      textterror = `{\\c&H${textcolor}&}${config_current.weatherheader}\\N\\N\\NUnfortunately the weather filler is unavailable at this time,\\N\\NHopefully it will be back soon\\N\\NThe Current Temperature is ${TEMPWITHUNIT}\\N\\NThe Current Humidity ${humidity}\%\\N\\NIt is Currently ${weatherDescription} outside\\N\\NInformation is correct as of ${dateTimeString}\\N`
    } else {
      textterror = `{\\c&H${textcolor}&}Unfortunately the weather filler is unavailable at this time,\\N\\N  Hopefully it will be back soon\\N\\N  The Current Temperature is ${TEMPWITHUNIT}\\N\\N  The Current Humidity ${humidity}\%\\N\\N  It is Currently ${weatherDescription} outside\\N\\N  Information is correct as of ${dateTimeString}\\N`
    }


// Calculate the start and end time for each subtitle
    let startTime = 0; // Start time adjusted by 2 seconds
    let endTime = config_current.weatherduration;

// Define the font size and line spacing
    const fontSize = 32;
    const lineSpacing = 1;

// Create the move effect string
    const moveEffect = ''//`{\\move(0,0,0,0)}`;
    const lines = `${textterror}`;
//    let lines = newsFeed;
    logger.info(`channel-offline template: ${lines}`)

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
    logger.debug(`weather error Ass text: ${assText}`)
    await fs.writeFileSync(`${path.join(WEATHERDIR, `error.ass`)}`, assText);

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

  const assfile = asssubstitution(`${path.join(WEATHERDIR, `error.ass`)}`);

  const creatWeatherScript = async () => {
    return await weatherTemplateReplacement(await currentTemplate());
  }

  const createWeather = async (image, fileName) => {
    try {
      logger.debug(`Weather Video fade out start: ${weatherCalculationsResult.weathervideofadeoutstart}`)
      const audioFile = await selectRandomAudioFile(config_current.customaudio);
      let calcHW = getImageWidthHeight(image, config_current.videoresolution);
      let audioCommand;
      if (config_current.readweather === true) {
        audioCommand = ffmpegSpeechOrMusicCommand(config_current.readweather, scriptAudioPath, await speedFactor(scriptAudioPath, config_current.weatherduration), 2);
      } else {
        audioCommand = ffmpegSpeechOrMusicCommand(config_current.readweather, audioFile);
      }
      //add theme information
      //part1
      const commandPart1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -i "${image}" -stream_loop -1 -filter_complex "[1]scale=${calcHW.vWidth}:${calcHW.vHeight}[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -i ${audioCommand} -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -t ${config_current.weatherduration} "${path.join(WEATHERDIR, fileName)}"`;
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
        if(config_current.readweather === true) {
          fadeAudio = '';
        } else {
            fadeAudio = `-af "afade=t=in:st=0:d=${config_current.weatheraudiofadeinduration},afade=t=out:st=${weatherCalculationsResult.weatheraudiofadeoutstart}:d=${config_current.weatheraudiofadeoutduration}"`;
        }
        const commandPart2 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i "${path.join(WEATHERDIR, fileName)}" -vf "fade=t=in:st=0:d=${config_current.weathervideofadeinduration},fade=t=out:st=${weatherCalculationsResult.weathervideofadeoutstart}:d=${config_current.weathervideofadeoutduration}" ${fadeAudio} -c:v ${config_current.ffmpegencoder} "${path.join(config_current.output, fileName)}"`;
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


  try {
      await downloadimages();
      if(config_current.readweather === true) {
          const script = await creatWeatherScript();
          await createAudio(script, config_current.audiolanguage, scriptAudioPath);
      }

      await createDirectoryIfNotExists(config_current.output);
      await createWeather(path.join(WEATHERDIR, 'v1.png'), 'weather-v1.mp4');
      await createWeather(path.join(WEATHERDIR, 'v2.png'), 'weather-v2.mp4');
      await createWeather(path.join(WEATHERDIR, 'v3.png'), 'weather-v3.mp4');
  } catch (error) {
      logger.error(error);
        isFunctionRunning = false;
        throw error
  }

//createWeatherV4();


//const v4basecreation = async () => {
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${config_current.backgroundcolour}:${config_current.videoresolution} -i ${config_current.weatherdir}/v1.png -stream_loop -1 -i "${config_current.randomaudioweather1}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.weathervideolength} ${WEATHERDIR}/weatherv4/weather-v1.mp4`)
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${config_current.backgroundcolour}:${config_current.videoresolution} -i ${config_current.weatherdir}/v2.png -stream_loop -1 -i "${config_current.randomaudioweather2}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.weathervideolength} ${WEATHERDIR}/weatherv4/weather-v2.mp4`)
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${config_current.backgroundcolour}:${config_current.videoresolution} -i ${config_current.weatherdir}/v3.png -stream_loop -1 -i "${config_current.randomaudioweather3}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.weathervideolength} ${WEATHERDIR}/weatherv4/weather-v3.mp4`)
//}
  /**
   *check if weather v4 should be shuffled (add later)
   */
//if (config_current.shuffle_v4 === true){
  /**
   *add files to .txt file in random order if shuffled, on random if not shuffled
   */
//}else{

//}
//logger.info("adding all files to a txt file for concat")
  /*
  *add all files to a text file for concat
  */
// list all files in the directory
//fs.readdir(`${WEATHERDIR}/weatherv4/`, (err, files) => {
  //if (err) {
  //logger.error(err)
  //}

  // files object contains all files names
  // log them on console
  //files.forEach(file => {
  //fs.writeFile(`${WEATHERDIR}/weatherv4/weatherv4.txt`, file, (err) => {
  //if (err)
  //logger.error(err);
  //else {
  //logger.success("File written successfully\n");
  //}
//});
//    logger.info(file)
  //})
//})


  /**
   *generate weather v4 video
   */


//logger.info("generate weatherv4")

//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f concat -safe 0 -i ${config_current.WEATHERDIR}/weatherv4/weatherv4.txt -c copy ${WEATHERDIR}/weather-v4.mp4`)
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i ${WEATHERDIR}/weather-v4.mp4 -i "${config_current.randomaudioweather4}" -shortest -vf "fade=t=in:st=0:d=${config_current.weathervideofadeinduration},fade=t=out:st=${config_current.weathervideofadeoutstart}:d=${config_current.weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${config_current.weatheraudiofadeinduration},afade=t=out:st=${config_current.weatheraudiofadeoutstartv4}:d=${config_current.eatheraudiofadeoutduration}" ${config_current.output}/weather-v4.mp4`)
  isFunctionRunning = false;
}
module.exports = {
  WEATHER
}
