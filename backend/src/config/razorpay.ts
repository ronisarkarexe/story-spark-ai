import Razorpay from "razorpay";

let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

export const getRazorpay = (): InstanceType<typeof Razorpay> => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
};

export default getRazorpay;
