const winston = require('winston');
const { format } = winston;
const DailyRotateFile = require('winston-daily-rotate-file');
const {LOGFOLDER} = require("../constants/path.constants");
const path = require('path');
const {error} = require("winston");

// Define your custom log levels
const customLevels = {
  success: 0,
  info: 1,
  updates: 2,
  warn: 3,
  error: 4,
  ffmpeg: 5,
  debug: 6
};

// Define colors for the custom log levels
const customLevelColors = {
  success: 'green',
  debug: 'blue',
  info: 'cyan',
  updates: 'purple',
  warn: 'yellow',
  error: 'red',
  ffmpeg: 'orange'
};

// Apply colors to the custom log levels
winston.addColors(customLevelColors);

// Define the custom timestamp format
const customTimestamp = () => {
  const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

return formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Define the log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  let stack = ''
  if(level === 'error') {
    stack = message.hasOwnProperty('stack')? "| " + message.stack : "| " + new Error().stack;
  }
  return `${timestamp} | ${level}: ${message} ${stack}`;
});

// Create the logger
  const logger = winston.createLogger({
    levels: customLevels,
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({ format: customTimestamp }),
      logFormat
    ),
    transports: [
      new winston.transports.Console(),
      new DailyRotateFile({
        filename: `${path.join(LOGFOLDER, 'ersatztv-filler')}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d', // Keep logs for 7 days
        level: 'error'
      }),
      new DailyRotateFile({
        filename: `${path.join(LOGFOLDER, 'ersatztv-filler-ffmpeg')}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d', // Keep logs for 7 days
        level: 'ffmpeg'
      }),
      new DailyRotateFile({
        filename: `${path.join(LOGFOLDER, 'ersatztv-filler-Debug')}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d', // Keep logs for 7 days
        level: 'debug'
      })
    ]
  });




module.exports = logger;
