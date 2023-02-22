const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile, settheme } = require("../utils/config.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");

const loadApiRoutes = (app) => {
    /**
     * Patch route to receive updates to the configuration file.
     */
    app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, async (req, res) => {
        for (const [key, value] of Object.entries(req.body)) {
            await writeValueToConfigurationFile(key, value)
        }

        res.send({ result: "success" })
    });

    app.get('/api/themes/download', (req, res) => {
    const url = req.query.url;
    const filepath = `themes/${req.query.filepath}`;
    console.log(req.query.filepath)

    // use the url and path variables to download the image
    downloadImage(url, filepath)
      .then(() => {
        res.status(200).send('Image downloaded successfully.');
      })
      .catch((error) => {
        res.status(500).send(`Error downloading image: ${error.message}`);
      });
  });

  app.get('/api/themes/settheme', async (req, res) => {
  const theme = req.query.theme;
  console.log(req.query.theme)
await settheme()
  // use the url and path variables to set the theme

});

}

module.exports = {
    loadApiRoutes
}
