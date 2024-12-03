const os = require('os');
const path = require('path')

// Path calculation
// serverLocation is Internal
// startuppath is external


if (process.pkg) {
  startUpPath = path.resolve(process.execPath, '..');
} else {
  startUpPath = process.cwd();
}


// Assuming __dirname is "x/y"
const fullDirName = __dirname;

// Use path.dirname to get the parent directory
const parentDirName = path.dirname(fullDirName);

const serverLocation = path.dirname(parentDirName);


// Theme Consts
const CURRENT_THEME_VERSION = '3'
const THEMES_FOLDER = path.join(startUpPath, 'themes');


// Web server consts
const TEMPLATES_FOLDER = path.join(serverLocation, 'server', 'templates'); // Have to do this because it expects the layout in the top level directory.
const LAYOUTS_FOLDER = "layouts/";
const PAGES_FOLDER = "pages/";
const DEFAULT_LAYOUT = path.join(LAYOUTS_FOLDER, 'layout.ejs');

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


// Config consts
const DEFAULT_CONFIG = {
  "customaudio": "",
  "output": "",
  "fillersubdirs": false,
  "city": "Austin",
  "state": "Texas",
  "country": "US",
  "videolength": "30",
  "ersatztv": "http://127.0.0.1:8409",
  "videoresolution": "1280x720",
  "webport": "8408",
  "webtheme": "dark",
  "audiolanguage": "en",
  "theme": "SystemLight",
  "processweather": true,
  "usewttrin": false,
  "readweather": true,
  "customweatherreaderscript": "",
  "booked_code": '',
  "generate_weatherv4": false,
  "weathervideofadeoutduration": "5",
  "weathervideofadeinduration": "5",
  "weatheraudiofadeoutduration": "5",
  "weatheraudiofadeinduration": "5",
  "weatherheader": "Current Weather",
  "showweatherheader": false,
  "weatherinterval": "10",
  "weatherduration": "30",
  "temperatureunits": "",
  "processnews": true,
  "newsvideofadeoutduration": "5",
  "newsvideofadeinduration": "5",
  "newsaudiofadeoutduration": "5",
  "newsaudiofadeinduration": "5",
  "newsfeed": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "newsduration": "60",
  "newsarticles": "10",
  "readnews": false,
  "newsreadintro": "",
  "newsreadoutro": "",
  "readonlynewsheadings": true,
  "shownewsheader": true,
  "newsheadertext": "Top News Stories",
  "underlinenewsheader": true,
  "newsinterval": "30",
  "processchanneloffline": true,
  "offlineinterval": "5",
  "processxmltvmerger": false,
  "epgfiles": "",
  "mergexmltvondemand": true,
  "xmltvmergeinterval": "20",
  "processvanitycards": true,
  "amountvanitycards": "5",
  "vanitycardduration": "30",
  "vanityinterval": "10",
  "customffmpeg": "",
  "ffmpegencoder": "libx264",
  "hwaccel": "",
  "hwaccel_device": "",
  "processchannellogo": true,
  "channellogovideofadeoutduration": "5",
  "channellogovideofadeinduration": "5",
  "channellogoaudiofadeoutduration": "5",
  "channellogoaudiofadeinduration": "5",
  "channellogointerval": "10",
  "channellogoduration": "30",
}

/** DIR CONSTS */
const CONFIG_DIR = path.join(startUpPath, 'config');
const USER_CONFIG = path.join(CONFIG_DIR, 'config.json');
const PASSWORD = path.join(CONFIG_DIR, 'password.json');

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


// Resources Consts
const CHANGELOG = path.join(serverLocation, 'Changelog.md');
const README = path.join(startUpPath, 'README.md');
const RESOURCESPATH = path.join(startUpPath, 'resources');


// FFMPEG Consts
const FFMPEGPATH = path.join(RESOURCESPATH, 'ffmpeg');
const FFMPEGPATHINTERNAL = path.join(serverLocation, 'ffmpeg');
let FFMPEGCOMMAND;

if (os.platform() === 'win32') {
  FFMPEGCOMMAND = `"${path.join(FFMPEGPATH, 'ffmpeg-windows.exe')}" -y`;
} else if (os.platform() === 'linux') {
  FFMPEGCOMMAND = `"${path.join(FFMPEGPATH, 'ffmpeg-linux')}" -y`; // Specify the Linux command
} else if (os.platform() === 'darwin') {
  FFMPEGCOMMAND = `"${path.join(FFMPEGPATH, 'ffmpeg-darwin')}" -y`; // Specify the macOS/Darwin command
} else {
  // Handle other platforms or provide a default value
  FFMPEGCOMMAND = "ffmpeg -y"
    logger.warn("OS unsupported trying safe fallback of ffmpeg -y")
}


// Workdir
const WORKDIR = path.join(startUpPath, 'workdir');


// Audio Consts
const AUDIOFALLBACK = path.join(RESOURCESPATH, 'audio-fallback');
const AUDIOFALLBACKINTERNAL = path.join(serverLocation, 'audio-fallback');


// News Consts
const NEWSDIR = path.join(WORKDIR, 'News');


// Weather Consts
const WEATHERDIR = path.join(WORKDIR, 'Weather');


// Channel Offline Consts
const CHANNEL_OFFLINEDIR = path.join(WORKDIR, 'Channel-offline');


// Channel logo consts
const CHANNEL_LOGODIR = path.join(WORKDIR, 'Channel-logo');

// Provider logo consts
const PROVIDER_LOGODIR = path.join(WORKDIR, 'Provider-logo');


// XMLTV MERGER consts
const XMLTVMERGEDIR = path.join(WORKDIR, 'xmltvmerge');


// Vanity Card consts
const VANITYCARDDIR = path.join(WORKDIR, 'vanitycard');


// Config upload Consts
const CONFIGCONFDIR = path.join(WORKDIR, 'configconf');


// Logs Consts
const LOGFOLDER = path.join(startUpPath, 'logs');

const DEFAULT_WEATHER_SCRIPT = `
{{header}}. Today is {{currentConditions.date}} and this is the forecast for {{location.city}} {{location.state}}.
The sky is currently {{currentConditions.conditions}} with a temperature of {{currentConditions.temp}} degrees with wind coming out of the {{currentConditions.windDir}} at {{currentConditions.windspeed}}.
The high today will be {{forecast.today.maxtemp}} with a low of {{forecast.today.mintemp}}.
The forecast for tomorrow is for a high of {{forecast.1.maxtemp}} and a low of {{forecast.1.mintemp}}.
Temperatures on {{forecast.2.day}} will go up to {{forecast.2.maxtemp}} degrees and fall down to {{forecast.2.mintemp}} degrees.`



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
    CONFIG_DIR,
    PASSWORD,
    CHANNEL_LOGODIR,
    CURRENT_THEME_VERSION,
    DEFAULT_WEATHER_SCRIPT,
    PROVIDER_LOGODIR
  };
