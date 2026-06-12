import { Request, Response } from "express";
import * as newsletterService from "./newsletter.service";
import { status as httpStatus } from "http-status";

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, name, source } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required." });
    }
    const userId = (req as any).user?.id;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = await newsletterService.subscribeNewsletter(email, name, source, userId, baseUrl);
    res.status(200).json(result);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This email is already subscribed." });
    }
    res.status(400).json({ message: err.message });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const result = await newsletterService.verifyNewsletter(token);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const unsubscribeByToken = async (req: Request, res: Response) => {
  try {
    const token = (req.params.token as string || "").trim();
    const safeToken = Array.isArray(token) ? token[0] : token;
    const result = await newsletterService.unsubscribeByToken(safeToken);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
