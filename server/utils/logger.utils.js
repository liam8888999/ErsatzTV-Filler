const winston = require('winston');
const { format } = winston;

// Define your custom log levels
const customLevels = {
  success: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  ffmpeg: 5
};

// Define colors for the custom log levels
const customLevelColors = {
  success: 'green',
  debug: 'blue',
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
  ffmpeg: 'orange'
};

// Apply colors to the custom log levels
winston.addColors(customLevelColors);

// Define the log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger
const logger = winston.createLogger({
  levels: customLevels,
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs.log' }),
    new winston.transports.File({ filename: 'ffmpeg.log', level: 'ffmpeg' })
  ]
});



module.exports = logger;
