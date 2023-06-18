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
  const { createDirectoryIfNotExists } =require("../utils/file.utils")

const NEWS = async () => {

    createDirectoryIfNotExists(NEWSDIR);
  const config_current = await retrieveCurrentConfiguration();
  const audioFile = await selectRandomAudioFile(config_current.customaudio);
  const fontFilePath = path.resolve(__dirname, `${config_current.fontfile}`);

  const newsstyle = `${NEWSDIR}/news.xslt`;

  // Write the (simple) stylesheet to a convenient file -- we will edit it in place later
  const stylesheetContent = `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/rss/channel">
      <xsl:for-each select="item">
        <b><xsl:value-of select="title"/></b><br/>
        <xsl:value-of select="description"/>
      </xsl:for-each>
    </xsl:template>
  </xsl:stylesheet>`;

  fs.writeFileSync(newsstyle, stylesheetContent);

  logger.info('Generating the news feed');

  const newsfeed = `${config_current.newsfeed}`;

  // Generate Results
  https.get(newsfeed, (response) => {
    let xmlData = '';

    response.on('data', (chunk) => {
      xmlData += chunk;
    });

    response.on('end', () => {
      const $ = cheerio.load(xmlData, { xmlMode: true });

      let newsFeed = '';

      $('rss > channel > item').each((index, element) => {
        const title = $(element).find('title').text();
        const description = $(element).find('description').text();

        newsFeed += `${title}\n${description}\n\n`;
      });

      fs.writeFileSync(`${NEWSDIR}/newstemp.txt`, newsFeed);

      // Read the newstemp.txt file
      const newstempContent = fs.readFileSync(`${NEWSDIR}/newstemp.txt`, 'utf8');


const news1Content = newstempContent
      // Copy first 10 articles
      const news2Content = news1Content.split('\n\n').slice(0, `${config_current.newsarticles}`).join('\n\n');


      // Replace '%' with '\%'
      const newsContent = news2Content.replace(/%/g, '\\%');

      // Save the final result to news.txt
      fs.writeFileSync(`${NEWSDIR}/news-temp.txt`, newsContent);

      // Set the maximum number of lines per frame
      const maxLinesPerFrame = 70;

      // Read the input file
      const inputText = fs.readFileSync(`${NEWSDIR}/news-temp.txt`, 'utf8');

      // Split the inputText into separate lines
    //  const lines = inputText.split('\n');

    // Replace line breaks with \N
const lines = inputText.replace(/\n/g, '\\N');
logger.info(lines)

      // Calculate the duration for each subtitle
      const subtitleDuration = 0; // Duration in seconds

      // Calculate the start and end time for each subtitle
      let startTime = 0; // Start time adjusted by 2 seconds
      let endTime = `${config_current.newsduration}`;

      // Define the font size and line spacing
      const fontSize = 32;
      const lineSpacing = 1;

      // Split the subtitle into individual lines
      const lines2 = inputText.split('\n');

      // Calculate the total height of the subtitle
      const subtitleHeight = lines2.length * fontSize * lineSpacing + 80;
      logger.info(subtitleHeight)

      // Calculate the y-coordinate for the move effect
      const y1 = 720 + subtitleHeight;
      const y2 = 0;

      // Create the move effect string
      const moveEffect = `{\\move(640,${y1},640,${y2})}`;

      // Combine the move effect with the subtitle text
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
Dialogue: 0, 0:00:${startTime.toString().padStart(2, '0')}.00, 0:00:${endTime.toString().padStart(2, '0')}.00, Default, ScrollText, 0, 0, 0, ,${subtitle}`
;
    //  for (let i = 0; i < lines.length; i++) {
      //  const line = lines[i];

        // Add the start and end time for each subtitle
        //assText += `\nDialogue: 0, 0:00:${startTime.toString().padStart(2, '0')}.00, 0:00:${endTime.toString().padStart(2, '0')}.00, Default, ScrollText, 0, 0, 0, ,{\\move(640,720,640,0)}${line}`;

        // Increment the start and end time for the next subtitle
        //startTime += subtitleDuration;
        //endTime += subtitleDuration;
    //  }


      // Save the ASS text to a file
      fs.writeFileSync(`${NEWSDIR}/news.ass`, assText);






// Write the wrapped text to the output file
//fs.writeFileSync(`${NEWSDIR}/news.txt`, wrappedText, 'utf8');

      // Adjust the fontsize parameter to fit the text within the video width
      const resolution = config_current.videoresolution;
const width = resolution.split("x")[0];
      const textWidth = Math.floor(width / 40);

      const command = `${FFMPEGCOMMAND} -y -f lavfi -i color=white:${config_current.videoresolution} -stream_loop -1 -i "${config_current.customaudio}/${audioFile}" -shortest -vf "ass=${NEWSDIR}/news.ass" -c:a copy -t ${config_current.newsduration} ${NEWSDIR}/output.mp4`;

      logger.info(command);
      logger.ffmpeg(`command is ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          logger.ffmpeg(`stderr: ${stderr}`);
          return;
        }
        logger.info("end generate newsfeed");
      });
    });
  });
};

module.exports = {
  NEWS
};
