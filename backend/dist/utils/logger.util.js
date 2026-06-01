"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const isDevelopment = config_1.default.env === 'development';
const disableLogs = config_1.default.disable_logs;
const formatTimestamp = () => {
    return new Date().toISOString();
};
const writeLog = (level, args) => {
    if (disableLogs)
        return;
    if (!isDevelopment && level === 'debug')
        return;
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
    debug: (...args) => writeLog('debug', args),
    info: (...args) => writeLog('info', args),
    warn: (...args) => writeLog('warn', args),
    error: (...args) => writeLog('error', args),
};
exports.default = logger;
