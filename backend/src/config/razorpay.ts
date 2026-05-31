// Initializes and exports the Razorpay instance using credentials from environment variables
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "[Razorpay] Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. " +
    "Payment routes will be unavailable. Other API routes will still function normally."
  );
}

const razorpayInstance =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

export default razorpayInstance;