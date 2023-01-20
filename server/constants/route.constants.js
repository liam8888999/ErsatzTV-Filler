const API_BASE = "/api/"
const CONFIG_ROUTE = API_BASE + "config/"
const CONFIG_ROUTE_EDIT = CONFIG_ROUTE + "edit"

/**
 * Returns the route config options
 * @returns {{CONFIG_ROUTE_EDIT: string}}
 * @constructor
 */
const ROUTE_CONSTANTS = () => {
    return {
        CONFIG_ROUTE_EDIT
    }
}

module.exports = {
    ROUTE_CONSTANTS
}