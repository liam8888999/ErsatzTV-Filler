const {ROUTE_CONSTANTS} = require("../constants/route.constants");

const loadApiRoutes = (app) => {
    /**
     *
     */
    app.patch(ROUTE_CONSTANTS().CONFIG_ROUTE_EDIT, (req, res) => {
        console.log(req,res)
    });

}