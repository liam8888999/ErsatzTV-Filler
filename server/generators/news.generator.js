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
  let config_current = await retrieveCurrentConfiguration();
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

  const newsfeed = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml';

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

      // Add paragraph numbering
      const news1Content = newstempContent.replace(/(.+?\n\n)/g, (match, p1, offset) => `${offset / 4 + 1} ${p1}`);

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

// Wrap the text to the desired number of lines
const wrappedText = wordwrap(0, maxLinesPerFrame)(inputText);

// Write the wrapped text to the output file
fs.writeFileSync(`${WORKDIR}/news.txt`, wrappedText, 'utf8');

      // Adjust the fontsize parameter to fit the text within the video width
      const resolution = config_current.videoresolution;
const width = resolution.split("x")[0];
      const textWidth = Math.floor(width / 40);
console.log(width)

      const command = `ffmpeg -y -f lavfi -i color=black:${config_current.videoresolution} -stream_loop -1 -i "${config_current.customaudio}/${audioFile}" -shortest -vf "drawtext=textfile='${WORKDIR}/news.txt':x=(w-text_w)/2:y=h-40*t:fontcolor=black:fontsize=${textWidth}:box=1:boxcolor=white:boxborderw=5:line_spacing=6:fontfile=${fontFilePath}" -pix_fmt yuv420p -c:a copy -t 90 ${WORKDIR}/news-v1.mp4
`;

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
