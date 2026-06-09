import { Request, Response } from "express";
import * as newsletterService from "./newsletter.service";
import httpStatus from "http-status";

// Subscribe user to newsletter
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, name, source } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Valid email is required." });
    }

    // Extract logged-in user id from JWT token if available
    const userId = (req as any).user?.id;

    // Origin of the API request, used to build the unsubscribe link in the email.
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const result = await newsletterService.subscribeNewsletter(
      email,
      name,
      source,
      userId,
      baseUrl
    );

    res.status(httpStatus.OK).json(result);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(httpStatus.CONFLICT).json({
        message: "This email is already subscribed.",
      });
    }
    res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

// Verify newsletter subscription token
export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;

    const result = await newsletterService.verifyNewsletter(token);

    res.status(httpStatus.OK).json(result);
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

// Unsubscribe via token from the email link. Safe, no email enumeration.
export const unsubscribeByToken = async (req: Request, res: Response) => {
  try {
    const token = (req.params.token as string || "").trim();
    const safeToken = Array.isArray(token) ? token[0] : token;

    const result = await newsletterService.unsubscribeByToken(safeToken);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Successfully unsubscribed",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: err.message,
    });
  }
};
