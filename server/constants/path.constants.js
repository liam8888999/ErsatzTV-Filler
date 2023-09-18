const os = require('os');
const path = require('path')

//serverLocation is Internal
//startuppath is external


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

const TEMPLATES_FOLDER = path.join(serverLocation, 'server', 'templates'); // Have to do this because it expects the layout in the top level directory.
const LAYOUTS_FOLDER = "layouts/";
const PAGES_FOLDER = "pages/";
const THEMES_FOLDER = path.join(startUpPath, 'themes');
const DEFAULT_LAYOUT = path.join(LAYOUTS_FOLDER, 'layout.ejs');

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

const CONFIG_DIR = path.join(startUpPath, 'config');
const USER_CONFIG = path.join(CONFIG_DIR, 'config.json');
const PASSWORD = path.join(CONFIG_DIR, 'password.json');

const CHANGELOG = path.join(serverLocation, 'Changelog.md');
const README = path.join(startUpPath, 'README.md');
const RESOURCESPATH = path.join(startUpPath, 'resources');
const WORKDIR = path.join(startUpPath, 'workdir');
const NEWSDIR = path.join(WORKDIR, 'News');
const WEATHERDIR = path.join(WORKDIR, 'Weather');
const CHANNEL_OFFLINEDIR = path.join(WORKDIR, 'Channel-offline');
const XMLTVMERGEDIR = path.join(WORKDIR, 'xmltvmerge');
const VANITYCARDDIR = path.join(WORKDIR, 'vanitycard');
const CONFIGCONFDIR = path.join(WORKDIR, 'configconf');
const LOGFOLDER = path.join(startUpPath, 'logs');
const AUDIOFALLBACK = path.join(RESOURCESPATH, 'audio-fallback');
const AUDIOFALLBACKINTERNAL = path.join(serverLocation, 'audio-fallback');
const FFMPEGPATH = path.join(RESOURCESPATH, 'ffmpeg');
const FFMPEGPATHINTERNAL = path.join(serverLocation, 'ffmpeg');
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


let FFMPEGCOMMAND;

if (os.platform() === 'win32') {
  FFMPEGCOMMAND = path.join(FFMPEGPATH, 'ffmpeg-windows.exe -y');
  logger.info(FFMPEGCOMMAND)
} else if (os.platform() === 'linux') {
  FFMPEGCOMMAND = path.join(FFMPEGPATH, 'ffmpeg-linux -y'); // Specify the Linux command
  logger.info(FFMPEGCOMMAND)
} else if (os.platform() === 'darwin') {
  FFMPEGCOMMAND = path.join(FFMPEGPATH, 'ffmpeg-darwin -y'); // Specify the macOS/Darwin command
    logger.info(FFMPEGCOMMAND)
} else {
  // Handle other platforms or provide a default value
  FFMPEGCOMMAND = "ffmpeg -y"
    logger.info("OS unsupported trying safe fallback of ffmpeg -y")
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
    CONFIG_DIR,
    PASSWORD
  };
