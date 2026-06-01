import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = (req.headers["x-request-id"] as string) || uuidv4();
  req.headers["x-request-id"] = reqId; // Ensure it is available for logging
  res.setHeader("x-request-id", reqId);
  next();
};
