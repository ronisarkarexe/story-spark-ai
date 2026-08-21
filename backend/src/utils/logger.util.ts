import util from 'util';
import winston from 'winston';
import config from '../config';

const isDevelopment = config.env === 'development';

const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  silent: config.disable_logs,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.errors({ stack: true }),
    isDevelopment
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf((info) => {
            const { timestamp, level, message, stack, ...meta } = info;
            const splat = info[Symbol.for('splat') as unknown as keyof typeof info];
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            const splatStr = splat ? ` ${util.inspect(splat, { colors: true, depth: null })}` : '';
            return `${timestamp} ${level}: ${stack || message}${metaStr}${splatStr}`;
          })
        )
      : winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
