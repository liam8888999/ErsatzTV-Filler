const TEMPLATES_FOLDER = "server/templates/"; // Have to do this because it expects the layout in the top level directory.
const LAYOUTS_FOLDER = "layouts/";
const PAGES_FOLDER = "pages/";
const THEMES_FOLDER = "themes/"
const DEFAULT_LAYOUT = LAYOUTS_FOLDER + "layout.ejs";

const WORKDIR = "server/workdir/";

const DEFAULT_CONFIG = "sample-config.conf"
const USER_CONFIG = "config.conf"
/**
 * Returns the path constants for our ui templates
 * @returns {{TEMPLATES_FOLDER: string, DEFAULT_LAYOUT: string, LAYOUTS_FOLDER: string, PAGES_FOLDER: string}}
 * @constructor
 */
const TEMPLATE_CONSTANTS = () => {
    return {
        TEMPLATES_FOLDER, LAYOUTS_FOLDER, PAGES_FOLDER, DEFAULT_LAYOUT
    }
}
/**
 * Returns the path constants for our script config
 * @returns {{USER_CONFIG: string, DEFAULT_CONFIG: string}}
 * @constructor
 */
const CONFIG_CONSTANTS = () => {
    return {
        DEFAULT_CONFIG,
        USER_CONFIG
    }
}


const GENERATOR_CONSTANTS = () => {
    return {
        WORKDIR
    }
}

module.exports = {
    TEMPLATE_CONSTANTS,
    CONFIG_CONSTANTS,
    GENERATOR_CONSTANTS
};
