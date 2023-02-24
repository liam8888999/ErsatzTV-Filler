const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile } = require("../utils/config.utils.js");
const { settheme } = require("../utils/themes.utils.js");

const { downloadImage } = require("../utils/downloadimage.utils");

const loadApiConfigRoutes = (app) => {
    /**
     * Patch route to receive updates to the configuration file.
     */
    app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, async (req, res) => {
        for (const [key, value] of Object.entries(req.body)) {
            await writeValueToConfigurationFile(key, value)
        }

        res.send({ result: "success" })
    });

}

module.exports = {
    loadApiConfigRoutes
}
