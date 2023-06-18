const os = require('os');





const TEMPLATES_FOLDER = "server/templates/"; // Have to do this because it expects the layout in the top level directory.
const LAYOUTS_FOLDER = "layouts/";
const PAGES_FOLDER = "pages/";
const THEMES_FOLDER = "themes/"
const DEFAULT_LAYOUT = LAYOUTS_FOLDER + "layout.ejs";

const DEFAULT_CONFIG = "sample-config.conf"
const USER_CONFIG = "config.conf"

const CHANGELOG = "Changelog.md"
const DOCUMENTATION = "README.md"

const WORKDIR = "workdir"
const NEWSDIR = "workdir/News"
const WEATHERDIR = "workdir/Weather"
const CHANNEL_OFFLINEDIR = "workdir/Channel-offline"
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

const WORKDIRS = () => {
    return {
        WORKDIR, NEWSDIR, WEATHERDIR, CHANNEL_OFFLINEDIR
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


let FFMPEGCOMMAND;
if (os.platform() === 'win32') {
  FFMPEGCOMMAND = 'ffmpeg.exe';
} else {
  FFMPEGCOMMAND = 'ffmpeg';
}


module.exports = {
    TEMPLATE_CONSTANTS,
    CONFIG_CONSTANTS,
    CHANGELOG,
    DOCUMENTATION,
    WORKDIRS,
    FFMPEGCOMMAND
};
