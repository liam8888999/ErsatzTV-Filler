const http = require('http');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const {NEWSDIR, FFMPEGCOMMAND} = require("../constants/path.constants");
const {retrieveCurrentConfiguration} = require("../modules/config-loader.module");
const logger = require("../utils/logger.utils");
const {exec} = require('child_process');
const {selectRandomAudioFile} = require("./utils/randomaudio.utils");
const path = require('path');
const {createDirectoryIfNotExists} = require("../utils/file.utils");
const {themecolourdecoder, retrieveCurrentTheme} = require("../utils/themes.utils");
const {asssubstitution} = require("../utils/string.utils");
const {createAudio, speedFactor, ffmpegSpeechOrMusicCommand} = require("./utils/texttospeech.utils");

// TODO: Add support for multiple newsfeeds under the same variable , seperated and create different videos or join all together

let isFunctionRunning = false;
const NEWS = async () => {
  if (isFunctionRunning) {
    logger.warn('News Generator is already running.');
    return;
  }
  isFunctionRunning = true;
  const config_current = await retrieveCurrentConfiguration();

  let output_location;
 if (config_current.fillersubdirs) {
   output_location = `${path.join(config_current.output, `NEWS`)}`
 } else {
   output_location = config_current.output
 }

  const audioFile = await selectRandomAudioFile(config_current.customaudio);
  const current_theme = await retrieveCurrentTheme();
  const NEWSNUM = '1'

  let newsFeed2;

// Step 5: Generate the news feed
  const generateNewsFeed = async (config_current, audioFile, current_theme) => {
    const newsfeed = config_current.newsfeed;

    const protocol = newsfeed.startsWith('https') ? https : http;

    return new Promise((resolve, reject) => {
      const request = protocol.get(newsfeed, (response) => {
        let xmlData = '';

        response.on('data', (chunk) => {
          xmlData += chunk;
        });

        response.on('end', () => {
          const $ = cheerio.load(xmlData, {xmlMode: true});

          let newsFeed = '';
          let newsFeedcontent = '';
          let newsheader = '';
          logger.debug(`XMLDATA: ${xmlData}`);

          $('rss > channel > item').each((index, element) => {
            const title = $(element).find('title').text();
            const description = $(element).find('description').text();

            const titlecolor = themecolourdecoder(current_theme.News.newstitlecolour);
            const descriptioncolor = themecolourdecoder(current_theme.News.newstextcolour);

            if (config_current.underlinenewsheader === true) {
              newsheader = `{\\r}{\\b1}{\\c&H${titlecolor}&}{\\u1}${config_current.newsheadertext}{//u0}\n\n`
            } else {
              newsheader = `{\\r}{\\b1}{\\c&H${titlecolor}&}${config_current.newsheadertext}\n\n`
            }


            newsFeed += `{\\r}{\\b1}{\\c&H${titlecolor}&}${title}.\n{\\r}{\\b0}{\\c&H${descriptioncolor}&}${description}.\n\n`;
            logger.debug(`header text: ${config_current.newsheadertext}`)
            logger.debug(`show header: ${config_current.shownewsheader}`)
            if (config_current.shownewsheader === true) {
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

  // Initialize as number
  let newsfeedarticleamount = Number(config_current.newsarticles);

  // Add 1 if header should be shown
  if (config_current.shownewsheader === true) {
    newsfeedarticleamount = newsfeedarticleamount + 1;
  }
    const news2Content = news1Content.split('\n\n').slice(0, newsfeedarticleamount).join('\n\n');
    const newsContent = news2Content.replace(/%/g, '\\%').replace(/&lt;p&gt;/g, '').replace(/&lt;\/p&gt;/g, '').replace(/&lt;br&gt;/g, '').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<\/br>/g, '').replace(/<br>/g, '').replace(/<a\b[^>]*>.*?<\/a>/gi, '').replace(/&#160;/g, ' ').replace(/&#8217;/g, '\'');;
    const titlecolor = themecolourdecoder(current_theme.News.newstitlecolour);
    const descriptioncolor = themecolourdecoder(current_theme.News.newstextcolour);
    const descriptionpatternregex = new RegExp(`{\\\\r}{\\\\b0}{\\\\c&H${descriptioncolor}&}`, 'g');
    const titlepatternregex = new RegExp(`{\\\\r}{\\\\b1}{\\\\c&H${titlecolor}&}`, 'g');
    const headerregex = new RegExp(`${config_current.newsheadertext}`, 'g');
    const headerreplacedregex = `${config_current.newsheadertext}.`;
    logger.debug(newsContent)
    logger.debug(titlepatternregex)

    let intro;
    if (config_current.newsreadintro) {
      intro = `${config_current.newsreadintro}...`
    } else {
      intro = ''
    }
    if (config_current.readonlynewsheadings === true) {
      const titlePatternRegextitlekeep = new RegExp(`{\\\\r}{\\\\b1}{\\\\c&H${titlecolor}&}`);
      newsFeedread1 = newsContent.split('\n').filter(line => titlePatternRegextitlekeep.test(line)).join('\n').replace(titlepatternregex, '').replace(descriptionpatternregex, '').replace(/{\\u1}/g, '').replace(/{\/\/u0}/g, '').replace(headerregex, headerreplacedregex).replace(/\./g, '\.\.').replace(/\.\.\ \.\./g, '\.\.').replace(/U\.\.S/g, 'U\.S').replace(/U\.\.K/g, 'U\.K').replace(/U\.\.N/g, 'U\.N').replace(/\[\&\#8230\;]/g, '...')
      newsFeedread = `${intro} ${newsFeedread1} ${config_current.newsreadoutro}`
    } else {
      newsFeedread1 = newsContent.replace(titlepatternregex, '').replace(descriptionpatternregex, '').replace(/{\\u1}/g, '').replace(/{\/\/u0}/g, '').replace(headerregex, headerreplacedregex).replace(/\./g, '\.\.').replace(/\.\.\ \.\./g, '\.\.').replace(/U\.\.S/g, 'U\.S').replace(/U\.\.K/g, 'U\.K').replace(/U\.\.N/g, 'U\.N').replace(/\[\&\#8230\;]/g, '...')
      newsFeedread = `${intro} ${newsFeedread1} ${config_current.newsreadoutro}`
    }
    logger.debug(newsFeedread)
// Creates an "output.mp3" audio file with default English text

    if (config_current.readnews === true) {
      await createAudio(newsFeedread, config_current.audiolanguage, path.join(NEWSDIR, `news-audio-${NEWSNUM}.mp3`));
    }
    await fs.writeFileSync(`${path.join(NEWSDIR, `news-temp-${NEWSNUM}.txt`)}`, newsContent);
  };

// Step 7: Prepare the ASS subtitle text
  const prepareSubtitleText = async (config_current) => {
    const inputText = await fs.readFileSync(`${path.join(NEWSDIR, `news-temp-${NEWSNUM}.txt`)}`, 'utf8');
    const lines = inputText.replace(/\n/g, '\\N').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/\[\&\#8230\;]/g, '...');
    const maxLinesPerFrame = 70;
    const subtitleDuration = 0;
    let startTime = 0;
    let endTime = config_current.newsduration;
    // Set the font size different to text size to allow for longer text
    const fontSize = 32;
    const lineSpacing = 1;
    const lines2 = inputText.split('\n');
    const subtitleHeight = lines2.length * fontSize * lineSpacing + 80;
    const y1 = 720 + 1.01 * subtitleHeight;
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
    let hwaccel;
    let hwacceldevice;
    if (config_current.hwaccel == "") {
      hwaccel = ` `;
      logger.debug('HWaccell: no hwaccel'); // Use the constant as needed
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
    const resolution = config_current.videoresolution;
    const width = resolution.split("x")[0];
    const textWidth = Math.floor(width / 40);
    const backgroundcolour = current_theme.News.newsbackgroundcolour;
    const assfile = asssubstitution(`${path.join(NEWSDIR, `news-${NEWSNUM}.ass`)}`);
    const newsReadFile = path.join(NEWSDIR, `news-audio-${NEWSNUM}.mp3`);
    let command;
    logger.debug(assfile)
    ;
    let audioCommand;
    if (config_current.readnews === true) {
      audioCommand = ffmpegSpeechOrMusicCommand(config_current.readnews, newsReadFile, await speedFactor(newsReadFile, config_current.newsduration), 1);
    } else {
      audioCommand = ffmpegSpeechOrMusicCommand(config_current.readnews, audioFile);
    }
    command = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i ${audioCommand} -vf "ass='${assfile}'" -c:v ${config_current.ffmpegencoder} -t ${config_current.newsduration} "${path.join(output_location, `news-${NEWSNUM}.mp4`)}"`;
    logger.ffmpeg(`News ffmpeg command is ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(error);

        logger.error('If this symptom persists please check your ffmpeg version is at least 6.0 and has libass compiled in');
        // Run another FFmpeg command here on error
        const commandOnError3 = `${config_current.customffmpeg || FFMPEGCOMMAND}${hwaccel}${hwacceldevice}-f lavfi -i color=${backgroundcolour}:${config_current.videoresolution} -stream_loop -1 -i "${audioFile}" -shortest -filter_complex "[0:v]drawtext=text='Unfortunately the news filler is unavailable at this time, Hopefully it will be back soon':x=(W-tw)/2:y=(H-th)/2:fontsize=24:fontcolor=white[bg]" -map "[bg]" -map 1:a -c:v ${config_current.ffmpegencoder} -c:a copy -t ${config_current.newsduration} "${path.join(output_location, `news-${NEWSNUM}.mp4`)}"`;
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
try {
  createDirectoryIfNotExists(NEWSDIR);
  await generateNewsFeed(config_current, audioFile, current_theme);
  await prepareNewsContent(config_current);
  await prepareSubtitleText(config_current);
  await createDirectoryIfNotExists(output_location);
  await generateNewsVideo(config_current, audioFile);
} catch (error) {
  logger.error(error);
    isFunctionRunning = false;
    throw error
}
  isFunctionRunning = false;
};

module.exports = {
  NEWS
};
