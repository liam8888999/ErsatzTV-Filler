const http = require('http');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const { WORKDIR } = require("../constants/path.constants");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const logger = require("../utils/logger.utils");
const { exec } = require('child_process');
const wordwrap = require('wordwrap');
const { selectRandomAudioFile } = require("./utils/randomaudio.utils");
const path = require('path');

const NEWS = async () => {
  const config_current = await retrieveCurrentConfiguration();
  const audioFile = await selectRandomAudioFile(config_current.customaudio);
  const fontFilePath = path.resolve(__dirname, `${config_current.fontfile}`);

  const newsstyle = `${WORKDIR}/news.xslt`;

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

  console.log('Generating the news feed');

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

      fs.writeFileSync(`${WORKDIR}/newstemp.txt`, newsFeed);

      // Read the newstemp.txt file
      const newstempContent = fs.readFileSync(`${WORKDIR}/newstemp.txt`, 'utf8');


const news1Content = newstempContent
      // Copy first 10 articles
      const news2Content = news1Content.split('\n\n').slice(0, 10).join('\n\n');

      // Remove paragraph numbering
      const news12Content = news2Content.replace(/^10 /gm, '');
      const news13Content = news12Content.replace(/^0 /gm, '');
      const news14Content = news13Content.replace(/^1 /gm, '');
      const news15Content = news14Content.replace(/^2 /gm, '');
      const news16Content = news15Content.replace(/^3 /gm, '');
      const news17Content = news16Content.replace(/^4 /gm, '');
      const news18Content = news17Content.replace(/^5 /gm, '');
      const news19Content = news18Content.replace(/^6 /gm, '');
      const news20Content = news19Content.replace(/^7 /gm, '');
      const news21Content = news20Content.replace(/^8 /gm, '');
      const news22Content = news21Content.replace(/^9 /gm, '');

      // Replace '%' with '\%'
      const newsContent = news22Content.replace(/%/g, '\\%');

      // Save the final result to news.txt
      fs.writeFileSync(`${WORKDIR}/news-temp.txt`, newsContent);

      // Set the maximum number of lines per frame
      const maxLinesPerFrame = 70;

      // Read the input file
      const inputText = fs.readFileSync(`${WORKDIR}/news-temp.txt`, 'utf8');

      // Split the inputText into separate lines
    //  const lines = inputText.split('\n');

    // Replace line breaks with \N
const lines = inputText.replace(/\n/g, '\\N');
console.log(lines)

      // Calculate the duration for each subtitle
      const subtitleDuration = 4; // Duration in seconds

      // Calculate the start and end time for each subtitle
      let startTime = 1; // Start time adjusted by 2 seconds
      let endTime = 90 + subtitleDuration;
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
Dialogue: 0, 0:00:${startTime.toString().padStart(2, '0')}.00, 0:00:${endTime.toString().padStart(2, '0')}.00, Default, ScrollText, 0, 0, 0, ,{\\move(640,-120,640,0)}${lines}`
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
      fs.writeFileSync(`${WORKDIR}/news.ass`, assText);






// Write the wrapped text to the output file
//fs.writeFileSync(`${WORKDIR}/news.txt`, wrappedText, 'utf8');

      // Adjust the fontsize parameter to fit the text within the video width
      const resolution = config_current.videoresolution;
const width = resolution.split("x")[0];
      const textWidth = Math.floor(width / 40);

      const command = `ffmpeg -y -i ${WORKDIR}/news-v1.mp4 -vf "ass=${WORKDIR}/news.ass" -c:a copy ${WORKDIR}/output.mp4`;

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
        console.log("end generate newsfeed");
      });
    });
  });
};

module.exports = {
  NEWS
};
