import config from '../config';

const isDevelopment = config.env === 'development';
const disableLogs = config.disable_logs;
const formatTimestamp = (): string => {
  return new Date().toISOString();
};

const writeLog = (level: 'debug' | 'info' | 'warn' | 'error', args: unknown[]) => {
  if (disableLogs) return;
  if (!isDevelopment && level === 'debug') return;
  const prefix = `${formatTimestamp()} ${level.toUpperCase()}:`;
  if (level === 'error') {
    console.error(prefix, ...args);
    return;
  }
  if (level === 'warn') {
    console.warn(prefix, ...args);
    return;
  }
  console.log(prefix, ...args);
};

const logger = {
  debug: (...args: unknown[]) => writeLog('debug', args),
  info: (...args: unknown[]) => writeLog('info', args),
  warn: (...args: unknown[]) => writeLog('warn', args),
  error: (...args: unknown[]) => writeLog('error', args),
};

export default logger;
