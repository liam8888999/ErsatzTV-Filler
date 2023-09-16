const os = require('os');
const path = require('path')

//serverLocation is Internal
//startuppath is external


if (process.pkg) {
  startUpPath = path.resolve(process.execPath, '..') + "/";
} else {
  startUpPath = process.cwd() + "/";
}

// Assuming __dirname is "x/y"
const fullDirName = __dirname;

// Use path.dirname to get the parent directory
const parentDirName = path.dirname(fullDirName);

const serverLocation = path.dirname(parentDirName) + "/";

const TEMPLATES_FOLDER = serverLocation + "server/templates/"; // Have to do this because it expects the layout in the top level directory.
const LAYOUTS_FOLDER = "layouts/";
const PAGES_FOLDER = "pages/";
const THEMES_FOLDER = startUpPath + "themes"
const DEFAULT_LAYOUT = LAYOUTS_FOLDER + "layout.ejs";

const DEFAULT_CONFIG = {
  "customaudio": "",
  "output": "",
  "city": "Austin",
  "state": "Texas",
  "videolength": "30",
  "ersatztv": "http://127.0.0.1:8409",
  "videoresolution": "1280x720",
  "webport": "8408",
  "webtheme": "dark",
  "theme": "SystemLight",
  "processweather": "yes",
  "generate_weatherv4": "no",
  "weathervideofadeoutduration": "5",
  "weathervideofadeinduration": "5",
  "weatheraudiofadeoutduration": "5",
  "weatheraudiofadeinduration": "5",
  "weatherinterval": "10",
  "processnews": "yes",
  "newsvideofadeoutduration": "5",
  "newsvideofadeinduration": "5",
  "newsaudiofadeoutduration": "5",
  "newsaudiofadeinduration": "5",
  "newsfeed": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "newsduration": "60",
  "newsarticles": "10",
  "newsinterval": "30",
  "processchanneloffline": "yes",
  "offlineinterval": "5",
  "processxmltvmerger": "yes",
  "epgfiles": "",
  "xmltvmergeinterval": "20",
  "processvanitycards": "yes",
  "amountvanitycards": "5",
  "vanityinterval": "10",
  "customffmpeg": "",
  "ffmpegencoder": "libx264",
  "hwaccel": "",
  "hwaccel_device": "",
  "customffmpeg": ""
}

const CONFIG_DIR = startUpPath + "config/"
const USER_CONFIG = CONFIG_DIR + "config.json"

const CHANGELOG = serverLocation + "Changelog.md";
const README = startUpPath + "README.md"
const RESOURCESPATH = startUpPath + "resources"
const WORKDIR = startUpPath + "workdir"
const NEWSDIR = WORKDIR + "/News"
const WEATHERDIR = WORKDIR + "/Weather"
const CHANNEL_OFFLINEDIR = WORKDIR + "/Channel-offline"
const XMLTVMERGEDIR = WORKDIR + "/xmltvmerge"
const VANITYCARDDIR = WORKDIR + "/vanitycard"
const CONFIGCONFDIR = WORKDIR + "/configconf"
const LOGFOLDER = startUpPath + "logs"
const AUDIOFALLBACK = RESOURCESPATH + "/audio-fallback"
const AUDIOFALLBACKINTERNAL = serverLocation + "audio-fallback"
const FFMPEGPATH = RESOURCESPATH + "/ffmpeg"
const FFMPEGPATHINTERNAL = serverLocation + "ffmpeg"
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


// to update to
//https://chat.openai.com/share/68d63890-f33a-4154-a2ce-a42066133e8e
//and move to a different file more suited (probably 1 with the download stuff already)
let FFMPEGCOMMAND;

if (os.platform() === 'win32') {
  FFMPEGCOMMAND = `${FFMPEGPATH}/ffmpeg-win.exe -y`;
} else if (os.platform() === 'linux') {
  FFMPEGCOMMAND = `${FFMPEGPATH}/ffmpeg-linux -y`; // Specify the Linux command
} else if (os.platform() === 'darwin') {
  FFMPEGCOMMAND = `${FFMPEGPATH}/ffmpeg-darwin -y`; // Specify the macOS/Darwin command
} else {
  // Handle other platforms or provide a default value
  FFMPEGCOMMAND = "ffmpeg -y"
  console.log("operating system unknown, trying a safe default of ffmpeg -y")
}



module.exports = {
    TEMPLATE_CONSTANTS,
    CONFIG_CONSTANTS,
    CHANGELOG,
    WORKDIR,
    WEATHERDIR,
    NEWSDIR,
    CHANNEL_OFFLINEDIR,
    FFMPEGCOMMAND,
    XMLTVMERGEDIR,
    README,
    VANITYCARDDIR,
    CONFIGCONFDIR,
    THEMES_FOLDER,
    startUpPath,
    AUDIOFALLBACK,
    AUDIOFALLBACKINTERNAL,
    FFMPEGPATH,
    FFMPEGPATHINTERNAL,
    LOGFOLDER,
    serverLocation,
    RESOURCESPATH,
    CONFIG_DIR
  };
