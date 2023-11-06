const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { readFile } = require('fs');
const {THEMES_FOLDER, CURRENT_THEME_VERSION} = require("../constants/path.constants");
const path = require('path');
const fs = require("fs");
const https = require('https');


const loadApiThemeRoutes = (app) => {
  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Page routes Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    if (req.accepts('html')) {
    // Render an error HTML page
    res.status(status).send(`<html><head><style>body { background-color: #4d4d4d; }</style><title>Error</title></head><body><center><br><br><br><h1 style="color: red;">Error: ${status}</h1></center><br><center><h2 style="color: orange;">OOPS, Something went terribly wrong.</h2><br><span style="font-size: 48px;">🙁</span></center></body></html>`);

  } else {
    // Send a JSON response to the client
    res.status(status).json({ error: message });
  }
  });

// download theme api
    app.get('/api/themes/download', (req, res) => {
    const url = req.query.url;
    const filepath = `${path.join(THEMES_FOLDER, 'system', req.query.filepath)}`;
    logger.info(`Theme download req query filepath: ${req.query.filepath}`)

    // use the url and path variables to download the image
    downloadImage(url, filepath)
      .then(() => {
        res.status(200).send('Theme downloaded successfully.');
      })
      .catch((error) => {
        res.status(500).send(`Error downloading Theme: ${error.message}`);
        logger.error(`Error downloading Theme: ${error.message}`)
      });
  });

  // set theme api

  app.get('/api/themes/settheme', async (req, res) => {
  const theme = req.query.theme;
  logger.info(`Theme set req query theme: ${req.query.theme}`)
  await settheme(theme)
  // use the url and path variables to set the theme

});

// show theme json

app.get('/api/themes/readthemejson', async (req, res) => {
  const filepath = `${path.join(THEMES_FOLDER, req.query.filepath)}`;
  readFile(`${filepath}`, 'utf8', (err, data) => {
      if (err) {
        logger.error(`Error reading theme json: ${err}`);
        res.status(500).send('Error reading data file');
        return;
      }
      logger.debug(`Theme json: ${JSON.parse(data)}`)
      res.json(JSON.parse(data));
    });
  });

let themeName;
  app.post('/themecreator', (req, res) => {
      // Generate a unique filename based on the theme name
      themeName = req.body.themeName;
      const filename = themeName.replace(/ /g, '') + '.theme';
      const filePath = path.join(THEMES_FOLDER, 'user', filename);

      // Strip the "#" symbol from the color values
    const stripHash = (color) => color.replace('#', '');

    // Create an object to store the updated theme data with stripped colors
    const updatedThemeData = {
        "ErsatzTVFillerTheme": {
            "ThemeName": req.body.themeName,
            "Creator": req.body.creator,
            "ThemeVersion": CURRENT_THEME_VERSION
        },
        "Offline": {
            "offlinetextcolour": stripHash(req.body.offlineTextColour),
            "offlinetitlecolour": stripHash(req.body.offlineTitleColour),
            "offlinebackgroundcolour": stripHash(req.body.offlineBackgroundColour)
        },
        "News": {
            "newstextcolour": stripHash(req.body.newsTextColour),
            "newstitlecolour": stripHash(req.body.newsTitleColour),
            "newsbackgroundcolour": stripHash(req.body.newsBackgroundColour)
        },
        "Weather": {
            "weatherbackgroundcolour": stripHash(req.body.weatherBackgroundColour)
        },
        "ChannelLogo": {
            "channellogobackgroundcolour": stripHash(req.body.channellogoBackgroundColour)
        }
      };

      // Save the updated JSON data to the new file
      fs.writeFile(filePath, JSON.stringify(updatedThemeData, null, 4), (err) => {
              if (err) {
                  logger.error(err);
                  res.status(500).send('Error saving data');
              } else {
                  // Check if the "sendToWebhook" checkbox is checked
                  if (req.body.sendToWebhook === 'on') {
    // Send the file to the Discord webhook
    sendFileToDiscordWebhook(filePath, (error) => {
        if (error) {
            res.status(500).send('Error sending data to Discord Webhook.');
        } else {
              res.redirect("/themecreator");
        }
    });
} else {
    res.redirect("/themecreator");
}
              }
          });
      });


      function sendFileToDiscordWebhook(filePath, callback) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Log the file content before sending it
        logger.debug(`File Content: ${fileContent}`);

 const discordMessage = {
     content: `${themeName}`, // Your message here
     embeds: [
         {
             title: `${themeName}.theme`,
             fields: [
                 {
                     name: `${themeName}.theme`,
                     value: '```json\n' + JSON.stringify(JSON.parse(fileContent), null, 4) + '```',
                 },
             ],
         },
     ],
 };

        const options = {
            hostname: 'discord.com',
            port: 443,
            path: '/api/webhooks/1154413704662761562/t3xJYQY0jINPasvaZx46hG9JA1vwx6n0rpVPgZuupD70xMwTyYAvKtY3VssIlCPtctbD', // Replace with your webhook ID and token
            method: 'POST',
     headers: {
         'Content-Type': 'application/json',
     },
 };

 const req = https.request(options, (res) => {
       logger.info(`Response Status Code: ${res.statusCode}`);

       let responseText = '';

       res.on('data', (chunk) => {
           responseText += chunk;
       });

       res.on('end', () => {
           if (res.statusCode === 204) {
               logger.success('File sent to Discord webhook successfully.');
               callback(null);
           } else {
               logger.error(`Error sending file to Discord webhook. Status code: ${res.statusCode}`);
               logger.error(`Response Data: ${responseText}`);
               callback(new Error(`Error sending file to Discord webhook. Status code: ${res.statusCode}`));
           }
       });
   });

   req.on('error', (error) => {
       logger.error(`Error sending file to Discord webhook: ${error}`);
       callback(error);
   });

   // Send the JSON message as the request body
   req.write(JSON.stringify(discordMessage));
   req.end();
}




};





module.exports = {
    loadApiThemeRoutes
}
