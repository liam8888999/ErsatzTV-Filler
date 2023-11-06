const http = require('http');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const { NEWSDIR, FFMPEGCOMMAND } = require("../constants/path.constants");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const logger = require("../utils/logger.utils");
const { exec } = require('child_process');
const wordwrap = require('wordwrap');
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const path = require('path');
const { createDirectoryIfNotExists } = require("../utils/file.utils");
const { themecolourdecoder, retrieveCurrentTheme } = require("../utils/themes.utils");
const { asssubstitution } = require("../utils/string.utils");
const googleTTS = require('google-tts-api');
const mp3Duration = require('mp3-duration');

// TODO: Add support for multiple newsfeeds under the same variable , seperated and create different videos or join all together

let isFunctionRunning = false;
const NEWS = async () => {
  if (isFunctionRunning) {
    logger.error('News Generator is already running.');
    return;
  }
  isFunctionRunning = true;
const config_current = await retrieveCurrentConfiguration();
const audioFile = await selectRandomAudioFile(config_current.customaudio);
const current_theme = await retrieveCurrentTheme();
const NEWSNUM = '1'

let newsFeed2;

// Step 5: Generate the news feed
const generateNewsFeed = async (config_current, audioFile, current_theme) => {
  const newsfeed = config_current.newsfeed;

  await new Promise((resolve, reject) => {
    https.get(newsfeed, (response) => {
      let xmlData = '';

      response.on('data', (chunk) => {
        xmlData += chunk;
      });

      response.on('end', () => {
        const $ = cheerio.load(xmlData, { xmlMode: true });

        let newsFeed = '';
        let newsFeedcontent = '';
        let newsheader = '';
        logger.info(`XMLDATA: ${xmlData}`);

        $('rss > channel > item').each((index, element) => {
          const title = $(element).find('title').text();
          const description = $(element).find('description').text();

          const titlecolor = themecolourdecoder(current_theme.News.newstitlecolour);
          const descriptioncolor = themecolourdecoder(current_theme.News.newstextcolour);

          if (config_current.underlinenewsheader === 'yes') {
            newsheader = `{\\r}{\\b1}{\\c&H${titlecolor}&}{\\u1}${config_current.newsheadertext}{//u0}\n\n`
          } else {
            newsheader = `{\\r}{\\b1}{\\c&H${titlecolor}&}${config_current.newsheadertext}\n\n`
          }




          newsFeed += `{\\r}{\\b1}{\\c&H${titlecolor}&}${title}.\n{\\r}{\\b0}{\\c&H${descriptioncolor}&}${description}.\n\n`;
            logger.info(`header text: ${config_current.newsheadertext}`)
          logger.info(`show header: ${config_current.shownewsheader}`)
          if (config_current.shownewsheader === 'yes') {
            newsFeedcontent1 = newsheader + newsFeed;
            newsFeedcontent = newsFeedcontent1.replace(/\.\./g, '\.')
          } else {
            newsFeedcontent1 = newsFeed;
            newsFeedcontent = newsFeedcontent1.replace(/\.\./g, '\.')
          }
          });
        fs.writeFileSync(`${path.join(NEWSDIR, `newstemp-${NEWSNUM}.txt`)}`, newsFeedcontent);

        resolve(); // Resolve the promise when the operation is complete
      });

      response.on('error', (error) => {
        reject(error); // Reject the promise if there's an error
      });
    });
  });
};


// Step 6: Prepare the news content
const prepareNewsContent = async (config_current) => {
  const newstempContent = await fs.readFileSync(`${path.join(NEWSDIR, `newstemp-${NEWSNUM}.txt`)}`, 'utf8');
  const news1Content = newstempContent;
  const news2Content = news1Content.split('\n\n').slice(0, config_current.newsarticles).join('\n\n');
  const newsContent = news2Content.replace(/%/g, '\\%').replace(/&lt;p&gt;/g, '').replace(/&lt;\/p&gt;/g, '').replace(/&lt;br&gt;/g, '').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<\/br>/g, '').replace(/<br>/g, '')
  const titlecolor = themecolourdecoder(current_theme.News.newstitlecolour);
  const descriptioncolor = themecolourdecoder(current_theme.News.newstextcolour);
  const descriptionpatternregex = new RegExp(`{\\\\r}{\\\\b0}{\\\\c&H${descriptioncolor}&}`, 'g');
  const titlepatternregex = new RegExp(`{\\\\r}{\\\\b1}{\\\\c&H${titlecolor}&}`, 'g');
  const headerregex = new RegExp(`${config_current.newsheadertext}`, 'g');
  const headerreplacedregex = `${config_current.newsheadertext}.`;
  console.log(newsContent)
  console.log(titlepatternregex)

let intro;
if (config_current.newsreadintro) {
intro = `${config_current.newsreadintro}...`
} else {
  intro = ''
}
if (config_current.readonlynewsheadings === "yes") {
    const titlePatternRegextitlekeep = new RegExp(`{\\\\r}{\\\\b1}{\\\\c&H${titlecolor}&}`);
  newsFeedread1 = newsContent.split('\n').filter(line => titlePatternRegextitlekeep.test(line)).join('\n').replace(titlepatternregex, '').replace(descriptionpatternregex, '').replace(/{\\u1}/g, '').replace(/{\/\/u0}/g, '').replace(headerregex, headerreplacedregex).replace(/\./g, '\.\.')
  newsFeedread = `${intro} ${newsFeedread1} ${config_current.newsreadoutro}`
} else {
  newsFeedread1 = newsContent.replace(titlepatternregex, '').replace(descriptionpatternregex, '').replace(/{\\u1}/g, '').replace(/{\/\/u0}/g, '').replace(headerregex, headerreplacedregex).replace(/\./g, '\.\.')
  newsFeedread = `${intro} ${newsFeedread1} ${config_current.newsreadoutro}`
}
  console.log(newsFeedread)
// Creates an "output.mp3" audio file with default English text

if (config_current.readnews === "yes") {
  function createaudiofunct() {
    return new Promise((resolve) => {
      //createAudioFile(newsFeedread, path.join(NEWSDIR, `news-audio-${NEWSNUM}`));
      const audiolanguage = config_current.audiolanguage || 'en'
googleTTS.getAllAudioBase64(newsFeedread, { lang: `${audiolanguage}` }).then((results) => {
  const buffers = results.map(results => Buffer.from(results.base64, 'base64'));
      const finalBuffer = Buffer.concat(buffers);
      fs.writeFileSync(path.join(NEWSDIR, `news-audio-${NEWSNUM}.mp3`), finalBuffer);
      console.log(`Audio file ${path.join(NEWSDIR, `news-audio-${NEWSNUM}.mp3`)} created successfully`);
    })
    .catch((err) => {
      console.error(err);
    });
       setTimeout(resolve, 3000);
   });
}
await createaudiofunct()
}


  await fs.writeFileSync(`${path.join(NEWSDIR, `news-temp-${NEWSNUM}.txt`)}`, newsContent);
};

// Step 7: Prepare the ASS subtitle text
const prepareSubtitleText = async (config_current) => {
  const inputText = await fs.readFileSync(`${path.join(NEWSDIR, `news-temp-${NEWSNUM}.txt`)}`, 'utf8');
  const lines = inputText.replace(/\n/g, '\\N').replace(/<p>/g, '').replace(/<\/p>/g, '');
  const maxLinesPerFrame = 70;
  const subtitleDuration = 0;
  let startTime = 0;
  let endTime = config_current.newsduration;
  const fontSize = 32;
  const lineSpacing = 1;
  const lines2 = inputText.split('\n');
  const subtitleHeight = lines2.length * fontSize * lineSpacing + 80;
  const y1 = 720 + subtitleHeight;
  const y2 = 0;
  const moveEffect = `{\\move(640,${y1},640,${y2})}`;
  const subtitle = `${moveEffect}${lines}`;

  let assText = `[Script Info]
Title: Scrolling Text Example
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1280
PlayResY: 720

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default, Arial, 32, &H00000000, &H00000000, &H00000000, &H00000000, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 2, 30, 30, 30, 0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0, 0:00:${startTime.toString().padStart(2, '0')}.00, 0:00:${endTime.toString().padStart(2, '0')}.00, Default, ScrollText, 0, 0, 0, ,${subtitle}`;

  await fs.writeFileSync(`${path.join(NEWSDIR, `news-${NEWSNUM}.ass`)}`, assText);
};

// Step 8: Generate the news video
const generateNewsVideo = async (config_current, audioFile) => {
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
  const resolution = config_current.videoresolution;
  const width = resolution.split("x")[0];
  const textWidth = Math.floor(width / 40);
  const backgroundcolour = current_theme.News.newsbackgroundcolour;
  const assfile = asssubstitution(`${path.join(NEWSDIR, `news-${NEWSNUM}.ass`)}`)
  logger.info(assfile)


let speedFactor;
if (config_current.readnews === "yes") {
let fileduration;
await mp3Duration(path.join(NEWSDIR, `news-audio-${NEWSNUM}.mp3`), function (err, mp3fileduration) {
  if (err) return console.log(err.message);
  console.log('Your file is ' + mp3fileduration + ' seconds long');
  fileduration = mp3fileduration
});
speedFactor = fileduration / config_current.newsduration
console.log('speedFactor is:', speedFactor)
}
if (config_current.readnews === "yes") {
command = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${path.join(NEWSDIR, `news-audio-${NEWSNUM}.mp3`)}" -filter_complex "[1:a]atempo=${speedFactor},volume=2[a]" -map 0 -map "[a]" -vf "ass='${assfile}'" -c:v ${config_current.ffmpegencoder} -t ${config_current.newsduration} ${path.join(config_current.output, `news-${NEWSNUM}.mp4`)}`;
} else {
command = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -vf "ass='${assfile}'" -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.newsduration} ${path.join(config_current.output, `news-${NEWSNUM}.mp4`)}`;
}
  logger.ffmpeg(`News ffmpeg command is ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error: ${error.message}`);

      logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
      // Run another FFmpeg command here on error
const commandOnError3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=text='Unfortunately the news filler is unavailable at this time, Hopefully it will be back soon':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.newsduration} ${path.join(config_current.output, `news-${NEWSNUM}.mp4`)}`;
logger.ffmpeg(`Running news card fallback command on error: ${commandOnError3}`);
exec(commandOnError3, (error3, stdout3, stderr3) => {
  if (error3) {
    logger.error(`Error running news fallback command: ${error3.message}`);
    // Handle the error for the second command as needed.
  } else {
    logger.success('news fallback FFmpeg command executed successfully.');
  }
});
  return;
    }
    if (stderr) {
      logger.ffmpeg(`stderr: ${stderr}`);
    }
    logger.info("End generate newsfeed");
  });
};

// Step 9: Call all the functions in order

  createDirectoryIfNotExists(NEWSDIR);

  await generateNewsFeed(config_current, audioFile, current_theme);
  await prepareNewsContent(config_current);
  await prepareSubtitleText(config_current);
  await createDirectoryIfNotExists(config_current.output);
  await generateNewsVideo(config_current, audioFile);
  isFunctionRunning = false;
};

module.exports = {
  NEWS
};
