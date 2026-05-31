import { Request, Response } from "express";
import * as newsletterService from "./newsletter.service";

// Subscribe user to newsletter
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, name, source } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required." });
    }

    // Extract logged-in user id from JWT token if available
    const userId = (req as any).user?.id;

    const result = await newsletterService.subscribeNewsletter(
      email,
      name,
      source,
      userId
    );

    res.status(200).json(result);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "This email is already subscribed.",
      });
    }
    res.status(400).json({
      message: err.message,
    });
  }
};
// Verify newsletter subscription token
export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;

    const result = await newsletterService.verifyNewsletter(token);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Unsubscribe user from newsletter
export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await newsletterService.unsubscribeNewsletter(email);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};
// Generate unsubscribe token (to be sent via email link)
export const generateUnsubscribeToken = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const result = await newsletterService.generateUnsubscribeToken(email);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Unsubscribe via signed token — safe, no unauthenticated email enumeration
export const unsubscribeByToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const result = await newsletterService.unsubscribeByToken(token);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
