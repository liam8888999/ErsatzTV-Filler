
  /**
*Generate Weather
*V0.0.25 - Beta
*/
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const { downloadImage } = require("../utils/downloadimage.utils"); //unsure about this one
const { WORKDIR } = require("../constants/path.constants");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");






const { exec } = require("child_process")
const fs = require('fs');
const client = require('https');

const WEATHER = async () => {

console.log("starting weather")

/**
*Check if weather should be run
*/

if (retrieveCurrentConfiguration().processweather === "yes")

console.log("processing weather")
/**
*Choose random audio file from audio folder
*/

console.log("choosing random audio")
const randomaudioweather1 = async () => {
await selectRandomAudioFile()
}
const randomaudioweather2 = async () => {
await selectRandomAudioFile()
}
const randomaudioweather3 = async () => {
await selectRandomAudioFile()
}
const randomaudioweather4 = async () => {
await selectRandomAudioFile()
}


/**
*randomise background (for the future)
*/


/**
*set country (unneeded)
*/

/**
*download images
*/

/**
*image downloading
*/


console.log("Downloading weather images")

    downloadImage(`wttr.in/${retrieveCurrentConfiguration().city}.png${retrieveCurrentConfiguration().weathermeasurement}`, `${WORKDIR}/v1.png`)
    .then(console.log)
    .catch(console.error);

    downloadImage(`v2.wttr.in/${retrieveCurrentConfiguration().city}.png${retrieveCurrentConfiguration().weathermeasurement}`, `${WORKDIR}/v2.png`)
    .then(console.log)
    .catch(console.error);

    downloadImage(`v3.wttr.in/${retrieveCurrentConfiguration().state}.png${retrieveCurrentConfiguration().weathermeasurement}`, `${WORKDIR}/v3.png`)
    .then(console.log)
    .catch(console.error);

/**
*calculate fade times
*/
console.log("calculating fade times")
/**
*set variables
*/
const weathervideofadeoutduration = retrieveCurrentConfiguration().weathervideofadeoutduration;
const weatheraudiofadeoutduration = retrieveCurrentConfiguration().weatheraudiofadeoutduration;

/**
*set fade time
*/

const weathervideofadeoutstart = retrieveCurrentConfiguration().weathervideolength - retrieveCurrentConfiguration().weathervideofadeduration;
const weatheraudeofadeduration = retrieveCurrentConfiguration().weathervideolength - retrieveCurrentConfiguration().weatheraudiofadeduration;

/**
*make the videos
*/
console.log("creating videos")
exec(`ffmpeg -y -f lavfi -i color=${retrieveCurrentConfiguration().backgroundcolour}:${retrieveCurrentConfiguration().videoresolution} -i ${retrieveCurrentConfiguration().weatherdir}/v1.png -stream_loop -1 -i "${retrieveCurrentConfiguration().randomaudioweather1}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${retrieveCurrentConfiguration().weathervideolength} ${WORKDIR}/weather-v1.mp4`)
exec(`ffmpeg -y -i ${WORKDIR}/weather-v1.mp4 -vf "fade=t=in:st=0:d=${retrieveCurrentConfiguration().weathervideofadeinduration},fade=t=out:st=${retrieveCurrentConfiguration().weathervideofadeoutstart}:d=${retrieveCurrentConfiguration().weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${retrieveCurrentConfiguration().weatheraudiofadeinduration},afade=t=out:st=${retrieveCurrentConfiguration().weatheraudiofadeoutstart}:d=${retrieveCurrentConfiguration().weatheraudiofadeoutduration}" ${retrieveCurrentConfiguration().output}/weather-v1.mp4`)
exec(`ffmpeg -y -f lavfi -i color=${retrieveCurrentConfiguration().backgroundcolour}:${retrieveCurrentConfiguration().videoresolution} -i ${retrieveCurrentConfiguration().weatherdir}/v2.png -stream_loop -1 -i "${retrieveCurrentConfiguration().randomaudioweather2}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${retrieveCurrentConfiguration().weathervideolength} ${WORKDIR}/weather-v2.mp4`)
exec(`ffmpeg -y -i ${WORKDIR}/weather-v2.mp4 -vf "fade=t=in:st=0:d=${retrieveCurrentConfiguration().weathervideofadeinduration},fade=t=out:st=${retrieveCurrentConfiguration().weathervideofadeoutstart}:d=${retrieveCurrentConfiguration().weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${retrieveCurrentConfiguration().weatheraudiofadeinduration},afade=t=out:st=${retrieveCurrentConfiguration().weatheraudiofadeoutstart}:d=${retrieveCurrentConfiguration().weatheraudiofadeoutduration}" ${retrieveCurrentConfiguration().output}/weather-v2.mp4`)
exec(`ffmpeg -y -f lavfi -i color=${retrieveCurrentConfiguration().backgroundcolour}:${retrieveCurrentConfiguration().videoresolution} -i ${retrieveCurrentConfiguration().weatherdir}/v1.png -stream_loop -1 -i "${retrieveCurrentConfiguration().randomaudioweather3}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${retrieveCurrentConfiguration().weathervideolength} ${WORKDIR}/weather-v3.mp4`)
exec(`ffmpeg -y -i ${WORKDIR}/weather-v3.mp4 -vf "fade=t=in:st=0:d=${retrieveCurrentConfiguration().weathervideofadeinduration},fade=t=out:st=${retrieveCurrentConfiguration().weathervideofadeoutstart}:d=${retrieveCurrentConfiguration().weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${retrieveCurrentConfiguration().weatheraudiofadeinduration},afade=t=out:st=${retrieveCurrentConfiguration().weatheraudiofadeoutstart}:d=${retrieveCurrentConfiguration().weatheraudiofadeoutduration}" ${retrieveCurrentConfiguration().output}/weather-v3.mp4`)

/**
*check if v4 should be generated
*/

console.log("Checking if weatherv4 should be generated")

if (retrieveCurrentConfiguration().generate_weatherv4 === "yes")
console.log("starting weatherv4")

console.log("calculating fade times")

const weatherv4videolength = retrieveCurrentConfiguration().weathervideolength * 3
const weathervideofadeoutstartv4 = retrieveCurrentConfiguration().weatherv4videolength - retrieveCurrentConfiguration().weathervideofadeoutduration
const weatheraudiofadeoutstartv4 = retrieveCurrentConfiguration().weatherv4videolength2 - retrieveCurrentConfiguration().weatheraudiofadeoutduration

/**
*generate v1 to v4 without fade
*/

console.log("Generate weather v1-3 without fade")
exec(`ffmpeg -y -f lavfi -i color=${retrieveCurrentConfiguration().backgroundcolour}:${retrieveCurrentConfiguration().videoresolution} -i ${retrieveCurrentConfiguration().weatherdir}/v1.png -stream_loop -1 -i "${retrieveCurrentConfiguration().randomaudioweather1}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${retrieveCurrentConfiguration().weathervideolength} ${WORKDIR}/weatherv4/weather-v1.mp4`)
exec(`ffmpeg -y -f lavfi -i color=${retrieveCurrentConfiguration().backgroundcolour}:${retrieveCurrentConfiguration().videoresolution} -i ${retrieveCurrentConfiguration().weatherdir}/v2.png -stream_loop -1 -i "${retrieveCurrentConfiguration().randomaudioweather2}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${retrieveCurrentConfiguration().weathervideolength} ${WORKDIR}/weatherv4/weather-v2.mp4`)
exec(`ffmpeg -y -f lavfi -i color=${retrieveCurrentConfiguration().backgroundcolour}:${retrieveCurrentConfiguration().videoresolution} -i ${retrieveCurrentConfiguration().weatherdir}/v3.png -stream_loop -1 -i "${retrieveCurrentConfiguration().randomaudioweather3}" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t ${retrieveCurrentConfiguration().weathervideolength} ${WORKDIR}/weatherv4/weather-v3.mp4`)

/**
*check if weather v4 should be shuffled (add later)
*/
//if (retrieveCurrentConfiguration().shuffle_v4 === "yes"){
/**
*add files to .txt file in random order if shuffled, on random if not shuffled
*/
//}else{

//}
console.log("adding all files to a txt file for concat")
/*
*add all files to a text file for concat
*/
// list all files in the directory
fs.readdir(`${WORKDIR}/weatherv4/`, (err, files) => {
  if (err) {
    throw err
  }

  // files object contains all files names
  // log them on console
  files.forEach(file => {
    fs.writeFile(`${WORKDIR}/weatherv4/weatherv4.txt`, file, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});
    console.log(file)
  })
})


/**
*generate weather v4 video
*/


console.log("generate weatherv4")

exec(`ffmpeg -y -f concat -safe 0 -i ${retrieveCurrentConfiguration().workdir}/weatherv4/weatherv4.txt -c copy ${WORKDIR}/weather-v4.mp4`)
exec(`ffmpeg -y -i ${WORKDIR}/weather-v4.mp4 -i "${retrieveCurrentConfiguration().randomaudioweather4}" -shortest -vf "fade=t=in:st=0:d=${retrieveCurrentConfiguration().weathervideofadeinduration},fade=t=out:st=${retrieveCurrentConfiguration().weathervideofadeoutstart}:d=${retrieveCurrentConfiguration().weathervideofadeoutduration}" -af "afade=t=in:st=0:d=${retrieveCurrentConfiguration().weatheraudiofadeinduration},afade=t=out:st=${retrieveCurrentConfiguration().weatheraudiofadeoutstartv4}:d=${retrieveCurrentConfiguration().eatheraudiofadeoutduration}" ${retrieveCurrentConfiguration().output}/weather-v4.mp4`)
}
module.exports = {
    WEATHER
}
