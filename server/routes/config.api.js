const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { writeValueToConfigurationFile } = require("../utils/config.utils.js");

const loadApiRoutes = (app) => {
    /**
     *
     */
    app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, async (req, res) => {
        await writeValueToConfigurationFile(req.body)
        res.send({ result: "success" })
    });

}

module.exports = {
    loadApiRoutes
}