// Initializes and exports the Razorpay instance using credentials from environment variables
import Razorpay from "razorpay";

let razorpayInstance: typeof Razorpay | null = null;

export function getRazorpay(): typeof Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are missing in environment variables");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  }
  return razorpayInstance;
}

export default getRazorpay;