import morgan from "morgan";
import { Request, Response } from "express";
import logger from "../../utils/logger.util";

// Expose the per-request id (set by the requestId middleware) as a morgan token.
morgan.token<Request, Response>("id", (req) => req.id || "-");

const format = ":id :method :url :status :response-time ms - :res[content-length]";

// Route HTTP access logs through the shared logger so they honor disable_logs on serverless.
const httpLogger = morgan<Request, Response>(format, {
  stream: { write: (message: string) => logger.info(message.trim()) },
});

export default httpLogger;
