const winston = require('winston');
const { format } = winston;

// Define the log format
const logFormat = format.combine(
  format.colorize(), // Add colors to log levels
  format.timestamp(), // Add timestamp to log entries
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: 'info', // Set the logging level (e.g., 'info', 'warn', 'error')
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Output logs to console
    new winston.transports.File({ filename: 'logs.log' }) // Output logs to a file
  ]
});

module.exports = logger;
