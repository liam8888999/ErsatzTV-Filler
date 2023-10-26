const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const { downloadImage } = require("../utils/downloadimage.utils");
const { WEATHERDIR, FFMPEGCOMMAND } = require("../constants/path.constants");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const logger = require("../utils/logger.utils");
const { createDirectoryIfNotExists } =require("../utils/file.utils");
const {themecolourdecoder, retrieveCurrentTheme} = require("../utils/themes.utils");
const { exec } = require("child_process")
const fs = require('fs');
const client = require('https');
const path = require('path');
const { asssubstitution } = require("../utils/string.utils");

let isFunctionRunning = false;

const WEATHER = async () => {
  if (isFunctionRunning) {
    logger.error('Weather Generator is already running.');
    return;
  }
isFunctionRunning = true;
      createDirectoryIfNotExists(WEATHERDIR);
logger.info("starting weather")

const config_current = await retrieveCurrentConfiguration();
const current_theme = await retrieveCurrentTheme();
const weatherbackgroundcolour = current_theme.Weather.weatherbackgroundcolour;


if (config_current.hwaccel == "") {
  hwaccel = ` `;
  logger.info('Hwaccell: no hwaccel'); // Use the constant as needed
} else {
  hwaccel = ` -hwaccel ${config_current.hwaccel} `;
  logger.info(`Hwaccell: ${hwaccel}`);
}

if (config_current.hwaccel_device == "") {
  hwacceldevice = ``;
  logger.info('Hwaccell_device: no hwacceldevice'); // Use the constant as needed
} else {
  hwacceldevice = `-hwaccel_device ${config_current.hwaccel_device} `;
  logger.info(`Hwaccell_device: ${hwacceldevice}`);
}

let currentTempC;
let currentTempF;
let humidity;
let weatherDescription;
let textterror;
const downloadimages = async () => {
logger.info("Downloading weather images")
logger.info(`Current City: ${config_current.city}`)
logger.info(`Weatherdir: ${WEATHERDIR}`)

await downloadImage(`https://wttr.in/${config_current.city}.png`, `${path.join(WEATHERDIR, 'v1.png')}`)
    .then(logger.success)
    .catch(logger.error);

await downloadImage(`https://v2.wttr.in/${config_current.city}.png`, `${path.join(WEATHERDIR, 'v2.png')}`)
  .then(logger.success)
  .catch(logger.error);

await downloadImage(`https://v3.wttr.in/${config_current.state}.png`, `${path.join(WEATHERDIR, 'v3.png')}`)
  .then(logger.success)
  .catch(logger.error);

await downloadImage(`https://wttr.in/${config_current.city}?format=j1`, `${path.join(WEATHERDIR, 'weather.json')}`)
  .then(logger.success)
  .catch(logger.error);

await fs.promises.readFile(`${path.join(WEATHERDIR, 'weather.json')}`, 'utf8')
.then(data => {
// Parse the JSON data into a JavaScript object
weatherjsonObject = JSON.parse(data);

// Now you can work with the jsonObject
})
.catch(error => {
console.error('Error reading JSON file:', error);
});
console.log(weatherjsonObject)
const currentCondition = weatherjsonObject.current_condition[0];

currentTempC = currentCondition.temp_C;
currentTempF = currentCondition.temp_F;
humidity = currentCondition.humidity;
weatherDescription = currentCondition.weatherDesc[0].value;
console.log(currentTempC)
console.log(currentTempF)
console.log(humidity)
console.log(weatherDescription)
dateTimeString = currentCondition.localObsDateTime;


if (config_current.showweatherheader === "yes") {
textterror = `
              ${config_current.weatherheader}


Unfortunately the weather filler is unavailable at this time,

Hopefully it will be back soon

The Current Temperature is ${currentTempC}°C or ${currentTempF}°F

The Current Humidity ${humidity}percent

It is Currently ${weatherDescription} outside

Information is correct as of ${dateTimeString}
                    `
} else {
  textterror = `
  Unfortunately the weather filler is unavailable at this time,

  Hopefully it will be back soon

  The Current Temperature is ${currentTempC}°C or ${currentTempF}°F

  The Current Humidity ${humidity}percent

  It is Currently ${weatherDescription} outside

  Information is correct as of ${dateTimeString}
                      `
}

await fs.writeFileSync(`${path.join(WEATHERDIR, `error.txt`)}`, textterror);

  }


  const weathercalculations = async () => {
    const weathervideofadeoutstart = config_current.weatherduration - config_current.weathervideofadeoutduration;
    logger.info(`Weather video fade out start: ${weathervideofadeoutstart}`)
    const weatheraudiofadeoutstart = config_current.weatherduration - config_current.weatheraudiofadeoutduration;
    logger.info(`Weather Audio Fade out start: ${weatheraudiofadeoutstart}`)
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



const createWeatherV1 = async () => {
  try {
    logger.info(`Weather Video fade out start: ${weatherCalculationsResult.weathervideofadeoutstart}`)
    const audioFile = await selectRandomAudioFile(config_current.customaudio);
    //add theme information
    //part1
    const commandv1part1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -i ${path.join(WEATHERDIR, 'v1.png')} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -c:a copy -t ${config_current.weatherduration} ${path.join(WEATHERDIR, 'weather-v1.mp4')}`;
    logger.ffmpeg(`ffmpeg weather commandv1part1 is ${commandv1part1}`);

    exec(commandv1part1, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);

        logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
            const commandOnError1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=textfile='${asssubstitution(path.join(WEATHERDIR, 'error.txt'))}':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.weatherduration} ${path.join(config_current.output, 'weather-v1.mp4')}`;
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
      logger.success('Weather v1 part 1 created successfully.');

      //part2
      const commandv1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i ${path.join(WEATHERDIR, 'weather-v1.mp4')} -vf "fade=t=in:st=0:d=${config_current.weathervideofadeinduration},fade=t=out:st=${weatherCalculationsResult.weathervideofadeoutstart}:d=${config_current.weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${config_current.weatheraudiofadeinduration},afade=t=out:st=${weatherCalculationsResult.weatheraudiofadeoutstart}:d=${config_current.weatheraudiofadeoutduration}" -c:v ${config_current.ffmpegencoder} ${path.join(config_current.output, 'weather-v1.mp4')}`;
    logger.ffmpeg(`ffmpeg weather commandv1 is ${commandv1}`);
      exec(commandv1, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Error: ${error.message}`);

          logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');

    return;


          return;
        }
        if (stderr) {
          logger.ffmpeg(`stderr: ${stderr}`);
        }
        logger.success('Weather v1 created successfully.');
      });
    });
  } catch (err) {
    logger.error(err);
  }
};

const createWeatherV2 = async () => {
  try {
    const audioFile = await selectRandomAudioFile(config_current.customaudio);
    //add theme information
    //part1
    const commandv2part1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -i ${path.join(WEATHERDIR, 'v2.png')} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -c:a copy -t ${config_current.weatherduration} ${path.join(WEATHERDIR, 'weather-v2.mp4')}`;
    logger.ffmpeg(`ffmpeg weather commandv2part1 is: ${commandv2part1}`);

    exec(commandv2part1, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);

        logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');

        // Run another FFmpeg command here on error
              const commandOnError2 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=textfile='${asssubstitution(path.join(WEATHERDIR, 'error.txt'))}':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.weatherduration} ${path.join(config_current.output, 'weather-v2.mp4')}`;

  logger.ffmpeg(`Running weather fallback command on error: ${commandOnError2}`);
  exec(commandOnError2, (error20, stdout20, stderr20) => {
    if (error20) {
      logger.error(`Error running weather fallback command: ${error20.message}`);
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
      logger.success('Weather v2 part 1 created successfully.');

      //part2
      const commandv2 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i ${path.join(WEATHERDIR, 'weather-v2.mp4')} -vf "fade=t=in:st=0:d=${config_current.weathervideofadeinduration},fade=t=out:st=${weatherCalculationsResult.weathervideofadeoutstart}:d=${config_current.weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${config_current.weatheraudiofadeinduration},afade=t=out:st=${weatherCalculationsResult.weatheraudiofadeoutstart}:d=${config_current.weatheraudiofadeoutduration}" -c:v ${config_current.ffmpegencoder} ${path.join(config_current.output, 'weather-v2.mp4')}`;
logger.ffmpeg(`ffmpeg weather commandv2: ${commandv2}`);
      exec(commandv2, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Error: ${error.message}`);
          logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
          return;
        }
        if (stderr) {
          logger.ffmpeg(`stderr: ${stderr}`);
        }
        logger.success('Weather v2 created successfully.');
      });
    });
  } catch (err) {
    logger.error(err);
  }
};


const createWeatherV3 = async () => {
  try {
    const audioFile = await selectRandomAudioFile(config_current.customaudio);
    //add theme information
    //part1
    const commandv3part1 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -i ${path.join(WEATHERDIR, 'v3.png')} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -c:v ${config_current.ffmpegencoder} -pix_fmt yuv420p -c:a copy -t ${config_current.weatherduration} ${path.join(WEATHERDIR, 'weather-v3.mp4')}`;
    logger.ffmpeg(`ffmpeg weather commandv3part1: ${commandv3part1}`);

    exec(commandv3part1, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);
        logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');

        // Run another FFmpeg command here on error
  const commandOnError3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${weatherbackgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=textfile='${asssubstitution(path.join(WEATHERDIR, 'error.txt'))}':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.weatherduration} ${path.join(config_current.output, 'weather-v3.mp4')}`;
  logger.ffmpeg(`Running weather fallback command on error: ${commandOnError3}`);
  exec(commandOnError3, (error3, stdout3, stderr3) => {
    if (error3) {
      logger.error(`Error running weather fallback command: ${error3.message}`);
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
      logger.success('Weather v3 part 1 created successfully.');

      //part2
      const commandv3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}-i ${path.join(WEATHERDIR, 'weather-v3.mp4')} -vf "fade=t=in:st=0:d=${config_current.weathervideofadeinduration},fade=t=out:st=${weatherCalculationsResult.weathervideofadeoutstart}:d=${config_current.weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${config_current.weatheraudiofadeinduration},afade=t=out:st=${weatherCalculationsResult.weatheraudiofadeoutstart}:d=${config_current.weatheraudiofadeoutduration}" -c:v ${config_current.ffmpegencoder} ${path.join(config_current.output, 'weather-v3.mp4')}`;
logger.ffmpeg(`ffmpeg weather commandv3: ${commandv3}`);
      exec(commandv3, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Error: ${error.message}`);
          logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
          return;
        }
        if (stderr) {
          logger.ffmpeg(`stderr: ${stderr}`);
        }
        logger.success('Weather v3 created successfully.');
      });
    });
  } catch (err) {
    logger.error(err);
  }
};


await downloadimages();
await createWeatherV1();
await createWeatherV2();
await createWeatherV3();
//createWeatherV4();






//const v4basecreation = async () => {
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${config_current.backgroundcolour}:${config_current.videoresolution} -i ${config_current.weatherdir}/v1.png -stream_loop -1 -i "${config_current.randomaudioweather1}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.weathervideolength} ${WEATHERDIR}/weatherv4/weather-v1.mp4`)
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${config_current.backgroundcolour}:${config_current.videoresolution} -i ${config_current.weatherdir}/v2.png -stream_loop -1 -i "${config_current.randomaudioweather2}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.weathervideolength} ${WEATHERDIR}/weatherv4/weather-v2.mp4`)
//exec(`${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${config_current.backgroundcolour}:${config_current.videoresolution} -i ${config_current.weatherdir}/v3.png -stream_loop -1 -i "${config_current.randomaudioweather3}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${config_current.weathervideolength} ${WEATHERDIR}/weatherv4/weather-v3.mp4`)
//}
/**
*check if weather v4 should be shuffled (add later)
*/
//if (config_current.shuffle_v4 === "yes"){
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
