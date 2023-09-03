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
        logger.info(xmlData);

        $('rss > channel > item').each((index, element) => {
          const title = $(element).find('title').text();
          const description = $(element).find('description').text();

          const titlecolor = themecolourdecoder(current_theme.News.newstitlecolour);
          const descriptioncolor = themecolourdecoder(current_theme.News.newstextcolour);

          newsFeed += `{\\r}{\\b1}{\\c&H${titlecolor}&}${title}\n{\\r}{\\b0}{\\c&H${descriptioncolor}&}${description}\n\n`;
        });

        fs.writeFileSync(`${NEWSDIR}/newstemp.txt`, newsFeed);

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
  const newstempContent = await fs.readFileSync(`${NEWSDIR}/newstemp.txt`, 'utf8');

  const news1Content = newstempContent;
  const news2Content = news1Content.split('\n\n').slice(0, config_current.newsarticles).join('\n\n');
  const newsContent = news2Content.replace(/%/g, '\\%');
  await fs.writeFileSync(`${NEWSDIR}/news-temp.txt`, newsContent);
};

// Step 7: Prepare the ASS subtitle text
const prepareSubtitleText = async (config_current) => {
  const inputText = await fs.readFileSync(`${NEWSDIR}/news-temp.txt`, 'utf8');
  const lines = inputText.replace(/\n/g, '\\N');
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

  await fs.writeFileSync(`${NEWSDIR}/news.ass`, assText);
};

// Step 8: Generate the news video
const generateNewsVideo = async (config_current, audioFile) => {
  if (config_current.hwaccel == "") {
    hwaccel = ` `;
    console.log('no hwaccel'); // Use the constant as needed
  } else {
    hwaccel = ` -hwaccel ${config_current.hwaccel} `;
    console.log(hwaccel);
  }

  if (config_current.hwacceldevice == "") {
    hwacceldevice = ``;
    console.log('no hwacceldevice'); // Use the constant as needed
  } else {
    hwacceldevice = `-hwaccel_device ${config_current.hwacceldevice} `;
    console.log(hwacceldevice);
  }
  const resolution = config_current.videoresolution;
  const width = resolution.split("x")[0];
  const textWidth = Math.floor(width / 40);
  const backgroundcolour = themecolourdecoder(current_theme.News.newsbackgroundcolour);
  const command = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -vf "ass=${NEWSDIR}/news.ass" -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.newsduration} ${config_current.output}/news.mp4`;

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
    }
    logger.info("End generate newsfeed");
  });
};

// Step 9: Call all the functions in order

  createDirectoryIfNotExists(NEWSDIR);

  await generateNewsFeed(config_current, audioFile, current_theme);
  await prepareNewsContent(config_current);
  await prepareSubtitleText(config_current);
  await generateNewsVideo(config_current, audioFile);
  isFunctionRunning = false;
};

module.exports = {
  NEWS
};
