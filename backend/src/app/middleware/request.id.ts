import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const REQUEST_ID_HEADER = "X-Request-Id";

// Assigns a stable id to every request for tracing; honors an upstream X-Request-Id when present.
const requestId = (req: Request, res: Response, next: NextFunction) => {
  const incoming = req.headers["x-request-id"];
  const headerValue = Array.isArray(incoming) ? incoming[0] : incoming;
  const id = headerValue?.trim() || uuidv4();
  req.id = id;
  res.setHeader(REQUEST_ID_HEADER, id);
  next();
};

export default requestId;
