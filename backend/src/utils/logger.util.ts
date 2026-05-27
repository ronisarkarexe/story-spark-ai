import winston from 'winston';
import config from '../config';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const isDevelopment = config.env === 'development';

const developmentFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: isDevelopment
    ? combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        developmentFormat
      )
    : combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
      ),
  transports: [
    new winston.transports.Console()
  ],
});

export default logger;
