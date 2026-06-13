import { Request, Response } from 'express';

export const subscribe = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Bypassed subscribe" });
};

export const verify = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Bypassed verify" });
};

export const unsubscribeByToken = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Bypassed unsubscribe" });
};

export const getNewsletters = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [] });
};