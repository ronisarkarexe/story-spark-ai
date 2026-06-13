import { Request, Response } from 'express';

export const createOrder = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Bypassed payment" });
};

export const verifyPayment = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Bypassed payment" });
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [] });
};