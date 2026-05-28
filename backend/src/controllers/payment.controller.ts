import { Request, Response } from "express";
import crypto from "crypto";
import razorpayInstance from "../config/razorpay";

// Creates a new Razorpay order and returns the order details to the frontend
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    // Validate that amount is provided and is a positive number
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // Unique receipt ID using timestamp
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Verifies the payment signature to confirm the payment is legitimate
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate that all required payment fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Razorpay signature verification: HMAC-SHA256 of "order_id|payment_id"
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    // Compare expected signature with the one sent by Razorpay
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};